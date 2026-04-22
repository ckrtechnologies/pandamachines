const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const allRoutes = require('./routes/allRoutes');
const port = process.env.PORT || 5000;
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const chatSocket = require("./socket/chatSocket");

const server = http.createServer(app);



app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, HEAD, OPTIONS, POST, PUT, DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

// Setup socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Call socket handler file
chatSocket(io);



app.use(bodyParser.json());
connectDB();

// Routes
app.use('/panda-machines-api', allRoutes);

// Error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('APIs SERVER is perfectly working..');
});

// 404 Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({
        message: "Your requested API not found",
    });
});

server.listen(port, () => {
    console.log(`🚀 Server + Socket.IO running at port:${port}`);
});
