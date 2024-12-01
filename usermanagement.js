const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://NimishPasswordStrong:NimishPasswordStrong@nimish-cluster.rsgzv.mongodb.net/users?retryWrites=true&w=majority&appName=nimish-cluster");

const db = mongoose.connection;

// Connection Events
db.on('connected', () => {
    console.log('Mongoose is connected to the database');
});

db.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
    console.log('Mongoose is disconnected from the database');
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

async function makeuser(name, email, password) {
    console.log(name, email, password);
    const newUser = new User({
        name,
        email,
        password
    });

    try {
        const savedUser = await newUser.save();
        console.log('User saved successfully:', savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
    }

}

async function loginUser(email, Password) {
    console.log(`Trying to log in user with email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found');
        return false;
    }

    console.log('User found, checking password');
    if (user.password == Password) {
        console.log('Password is correct');
        return true;
    }

    console.log('Password is incorrect');
    return false;
}

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    // tags: { type: [String], required: true },
    githubLink: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
async function uploadProject(name, description, githubLink) {
    console.log(name, description, githubLink);
    const Project = mongoose.model('Project', projectSchema);
    if (!name || !description || !githubLink) {
        console.error('Project upload failed: missing parameters');
        return false;
    }

    const project = new Project({
        name,
        description,
        // tags: tag.split(',').map(t => t.trim()),
        githubLink
    });

    try {
        const savedProject = await project.save();
        console.log('Project uploaded successfully:', savedProject);
        return true;
    } catch (error) {
        console.error('Error uploading project:', error);
        return false;
    }
}

async function searchProjects(name, tags) {
    console.log("searching for", name);

    const Project = mongoose.model('Project', projectSchema);

    let query = {};

    if (name) query.name = { $regex: new RegExp(name, 'i') };
    if (tags) query.tags = { $in: tags.split(',').map(t => t.trim()) };

    try {
        const projects = await Project.find(query).populate('uploader');
        console.log('Search results:', projects);
        return projects;
    } catch (error) {
        console.error('Error searching projects:', error);
        return false;
    }
}

// async function deleteAllProjects() {
//     console.log('Deleting all projects');
//     const Project = mongoose.model('Project', projectSchema);
//     try {
//         await Project.deleteMany({});
//         console.log('All projects deleted');
//         return true;
//     } catch (error) {
//         console.error('Error deleting all projects:', error);
//         return false;
//     }
// }


module.exports = { makeuser, loginUser, uploadProject, searchProjects };