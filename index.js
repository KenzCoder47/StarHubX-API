const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://poomverta47:SkibidiNIgga@starhubx.gp8er.mongodb.net/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection successful!'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware to parse JSON requests
app.use(express.json());

// Define a Mongoose schema and model
const executionSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    count: { type: Number, default: 1 }
});

const Execution = mongoose.model('Execution', executionSchema);

// Default route for the main page
app.get('/', (req, res) => {
    res.send('This is my API running...');
});

// API endpoint to execute a script
app.post('/script-executed', async (req, res) => {
    const { userName, userId } = req.body;

    if (!userName || !userId) {
        return res.status(400).json({ error: "UserName and UserId are required." });
    }

    let execution = await Execution.findOne({ userId });
    if (!execution) {
        execution = new Execution({ userId, userName });
    } else {
        execution.count++;
    }

    await execution.save();

    const executedBy = `Script Executed by ${userName} | ${userId}`;
    res.json({ Executed: executedBy, "Total Executed": execution.count });
});

// API endpoint to get user info
app.get('/user-info', async (req, res) => {
    const users = await Execution.find();
    const responseArray = users.map(user => `${user.userName} | ${user.userId} [Executed: ${user.count}]`);
    res.json({ "Total All Executed Users": users.length, Users: responseArray });
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Listening on PORT ${PORT}`);
});

module.extports = app