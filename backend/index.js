import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'
import { createUser, getUsers, loginUser, logout, refreshToken } from "./controllers/userController.js";
import { verifyJWT } from "./utils.js";

const app = express()

mongoose.connect(process.env.MONGO).then(() => {
    console.log('db connected');
}).catch((error) => {
    console.log(error);
})

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.post('/api/create-user', createUser)
app.post('/api/login-user', loginUser)
app.get('/api/refresh-token', refreshToken)
app.get('/api/get-users', verifyJWT, getUsers)

//extra routes
app.post('/api/logout-user', logout)
app.get('/api/verify', verifyJWT, (req, res) => {
    res.json({
        success: true
    })
})


app.use((err, req, res, next) => {
    const statusCode = err.code || 500;
    const message = err.message || 'Internal server error';
    console.log(err);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(process.env.PORT, () => {
    console.log("Serever is started at port " + process.env.PORT);
})