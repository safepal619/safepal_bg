const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Authentication = require("./routes/authentication");
const User = require("./routes/User");
const FilesData = require("./routes/FilesData");


const { config } = require("dotenv");
// const cookieParser = require("cookie-parser");
const app = express();
// const cors = require('cors')


// const corsOptions = {
//     origin: 'http://localhost:3000',
//     allowedHeaders: {
//         "Access-Control-Allow-Headers": ['Content-Type', 'Authorization']
//     },
//     // credentials: {
//     //     "Access-Control-Allow-Credentials": true
//     // }
// }


// app.use(cors(corsOptions))


config({ path: "./.env" });


// app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-type, Authorization"
    );
    next();
});

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


// Schedule the cron job to run every minute
// cron.schedule('10 17 * * *', () => {

// * * * * *
// admin aproved user
// isadminApproved()
// console.log("cron")
// });



app.use("/api/auth", Authentication);


/**
 * user route
*/
app.use("/api/user", User)

app.use("/api/file", FilesData)


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
            app.listen(PORT, () => {
                console.log(`Connected on PORT ${PORT} || ${currentUrl}`);
            });
        }
    })
    .catch((e) => {
        console.log(e);
    });

// Export the Express API
module.exports = app;

