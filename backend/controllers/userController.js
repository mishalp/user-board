import User from '../models/user.js'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) return next({ message: "All fields are required", code: 400 })

        const isUserExist = await User.findOne({ email: email })
        if (isUserExist) return next({ message: "User already exist", code: 401 })

        const user = await User.create({
            name,
            email,
            password
        })

        res.json({
            success: true,
            user
        })

    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    try {

        if (!email || !password) return next({ message: "All fields are required", code: 400 })

        const user = await User.findOne({ email: email })
        if (!user) return next({ message: "User does not exist", code: 401 })

        const isCorrectPass = await user.comparePassword(password)
        if (!isCorrectPass) return next({ message: "Wrong password", code: 401 })

        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.ACCESS_SECRET,
            { expiresIn: 1000 * 60 * 5 }
        )

        const refreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            success: true,
            accessToken
        })

    } catch (error) {
        next(error)
    }
}

export const refreshToken = (req, res, next) => {
    try {
        const cookies = req.cookies
        if (!cookies?.jwt) return next({ message: "Unauthorized", code: 401 })

        const refreshToekn = cookies.jwt;
        jwt.verify(refreshToekn, process.env.REFRESH_SECRET, async (err, data) => {
            if (err) next({ message: "Forbidden", code: 403 })

            const user = await User.findById(data.userId)
            if (!user) next({ message: "Unauthorized", code: 401 })

            const accessToken = jwt.sign(
                {
                    userId: user._id
                },
                process.env.ACCESS_SECRET,
                { expiresIn: 1000 * 60 * 5 }
            )

            res.json({
                success: true,
                accessToken
            })
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return next({ message: "No content", code: 204 })

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ success: true, message: "Cookie cleared" })
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.json({
            success: true,
            users
        })
    } catch (error) {
        next(error)
    }
}