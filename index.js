const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Authentication = require("./routes/authentication");
const User = require("./routes/User");
const Message = require("./routes/Message");
const FilesData = require("./routes/FilesData");
// const RateLimit = require("express-rate-limit");

const { config } = require("dotenv");
const { corsConfigs } = require("./utils/corConfig");
// const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors')


config({ path: "./.env" });

// const socket = require("socket.io");


// const limiter = RateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 20,
//   });
//   // Apply rate limiter to all requests
//   app.use(limiter);

app.use(cors(corsConfigs))

const PORT = process.env.PORT || 5000;

////// URL FOR THE PROJECT
const prodUrl = `http://127.0.0.1:${PORT}`;
const liveUrl = `${process.env.currentUrl}:${PORT}`;
const currentUrl = liveUrl || prodUrl;

//// DATABASE URL local: process.env.MONGODB_URI ||| cloud:process.env.databaseUrl
const dbUrl = process.env.databaseUrl || process.env.MONGODB_URI;

// create application/json parser
const jsonParser = bodyParser.json();

app.use(jsonParser);


app.use("/api/auth", Authentication);


/**
 * user route
*/
app.use("/api/user", User)

app.use("/api/file", FilesData)

app.use("/api/message",Message)


/**
 * test route
 */
app.get("/", (req, res, next) => {
    res.status(200).send("API is running");
});


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data })
})


mongoose
    .connect(dbUrl, {
        autoIndex: true
    })
    .then((response) => {
        if (response) {
        
        }
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(PORT, () => {
        console.log(`Connected on PORT ${PORT} || ${currentUrl}`);
    });


    // // const io = new Server(server);
    // const io = socket(server, {
    //     cors: {
    //         // origin: `http://localhost:${PORT}`,
    //         origin: process.env.HOST_URL_FRONTEND,
    //         credentials: true
    //     }
    // });

    // global.onlineUsers = new Map()

    // io.on('connection', (socket) => {
    //     global.chatSocket = socket;

    //     socket.on("add-user", (userId) => {
    //         // console.log("userid: ",userId)
    //         onlineUsers.set(userId, socket.id)

    //     })
    //     socket.on("send-message", (data) => {
    //         // console.log("data:", data)
    //        const sendUserSocket = onlineUsers.get(data.to)

    //        if(sendUserSocket){
    //         socket.to(sendUserSocket).emit("message-received", data.message)
    //        }

    //     })


    // })

// Export the Express API
module.exports = app;

