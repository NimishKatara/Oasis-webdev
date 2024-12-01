// Function to download JSON data as a file
function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2); // Format JSON data with indentation
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


// Function to handle login form validation and check credentials in localStorage
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return false;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return false;
    }
    // Check if the credentials match stored data
    try {
        const response = await axios.get('/login', { params: { email, password } });
        if (response.data.success == true) {
            alert("User logged in");
        } else {
            alert("Incorrect credentials");
        }
    } catch (error) {
        console.log(error.response.data);
    }
}

// Function to handle signup form validation and save credentials to localStorage
async function handleSignUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return false;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return false;
    }

    // Password length check and match confirmation
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return false;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    // Store credentials as JSON data
    const credentials = { name: name, email: email, password: password };

    // Download the JSON file
    // downloadJSON(credentials, "user_credentials.json");

    try {
        await axios.get('/signup', { params: credentials });
        alert("Sign-up successful!");
        window.location.href = "/login.html";
    } catch (error) {
        console.error(error);
        alert("Sign-up failed. Please try again.");
    }
    return true;
}

// Function to handle project upload form
async function handleUpload() {
    const projectName = document.getElementById('projectName').value;
    const description = document.getElementById('description').value;
    const githubLink = document.getElementById('githubLink').value;

    if (!projectName || !description || !githubLink) {
        alert("Please fill in all fields and upload a file.");
        return false;
    }

    await axios.get("/upload", { params: { name: projectName, description, githubLink } }).then(response => {
        if (response.data.success == true) {
            alert("Project uploaded successfully!");
        } else {
            alert("Project upload failed. Please try again.");
        }
    });

    alert("Project uploaded successfully!");
    return true;
}

// Function to handle project search
function handleSearch() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const searchResults = document.querySelector('.search-results');

    // Clear previous results
    searchResults.innerHTML = "";

    if (searchInput) {
        // Dummy data for search (replace this with real data fetching if available)
        // const dummyProjects = [
        //     { name: "AI Project", tags: ["AI", "Python"] },
        //     { name: "Web Development", tags: ["Web", "JavaScript"] },
        //     { name: "Data Science", tags: ["Data", "Python"] },
        // ];

        // const results = dummyProjects.filter(project =>
        //     project.name.toLowerCase().includes(searchInput) ||
        //     project.tags.some(tag => tag.toLowerCase().includes(searchInput))
        // );

        axios.get('/search', { params: { name: searchInput } }).then(response => {
            console.log(response.data);
            if (response.data.success == true) {
                const results = response.data.projects;
                if (results.length > 0) {
                    results.forEach(project => {
                        const projectDiv = document.createElement("div");
                        projectDiv.classList.add("result-item");
                        projectDiv.innerHTML = `Project Found: <a target="_blank" rel="noopener noreferrer" href="${project.githubLink}">${project.name}</a>`;
                        searchResults.appendChild(projectDiv);
                    });
                } else {
                    searchResults.textContent = "No projects found.";
                }
            }
        })

        // if (results.length > 0) {
        //     results.forEach(project => {
        //         const projectDiv = document.createElement("div");
        //         projectDiv.classList.add("result-item");
        //         projectDiv.textContent = `Project: ${project.name}, Tags: ${project.tags.join(", ")}`;
        //         searchResults.appendChild(projectDiv);
        //     });
        // } else {
        //     searchResults.textContent = "No projects found.";
        // }
    } else {
        searchResults.textContent = "Please enter a search term.";
    }
}

// Event listeners for form submissions and buttons
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#login-button');
    const signupButton = document.querySelector('#signup-button');
    const uploadButton = document.querySelector('#upload-button');
    const searchButton = document.querySelector('#search-button');

    if (loginButton) loginButton.addEventListener('click', handleLogin);
    if (signupButton) signupButton.addEventListener('click', handleSignUp);
    if (uploadButton) uploadButton.addEventListener('click', handleUpload);
    if (searchButton) searchButton.addEventListener('click', handleSearch);
});























fetch('images.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error fetching images:', error));


fetch('sigin.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('error fetching sigin: ', error));

fetch('signup.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('error in signup page: ', error));


fetch('upload.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('error in upload page: ', error));

fetch('http://localhost:3000/images.json')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
