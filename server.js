const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Default route for '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html')); // Change to your default page if necessary
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/login", async (req, res) => {
    const { email, password } = req.query;
    console.log(email, password);
    const { loginUser } = require("./usermanagement.js");
    console.log(await loginUser(email, password));

    res.json({
        success: await loginUser(email, password)
    })
})

app.get("/signup", (req, res) => {
    // console.log(req.query);
    res.send(req.body);
    const { makeuser } = require("./usermanagement.js");
    makeuser(req.query.name, req.query.email, req.query.password);
})

app.get('/upload', (req, res) => {
    const { uploadProject } = require("./usermanagement.js");
    res.json({ success: uploadProject(req.query.name, req.query.description, req.query.githubLink) });
});
// Handle 404 errors for unmatched routes
// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); // Optional: create a 404.html page in 'public'
// });

app.get('/search', async (req, res) => {
    const { name, tags } = req.query;
    const { searchProjects } = require("./usermanagement.js");
    const results = await searchProjects(name, tags);
    res.json({ projects: results, success: true });
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const { engine } = require("express-handlebars");

app.set("views", path.join(__dirname, "views"));
app.get('/home', (req, res) => {
    res.render('home', { title: 'Home' });
})

app.engine('handlebars',
    engine({
        layoutsDir: path.join(__dirname, 'views'),
        partialsDir: path.join(__dirname, 'views'),
        defaultLayout: 'main',
    })
);

app.set('view engine', 'handlebars');
app.get('/', (req, res) => {
    res.render('home', { title: 'Home', message: 'welcome to home page' });
})