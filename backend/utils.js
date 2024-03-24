import jwt from 'jsonwebtoken'

export const verifyJWT = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined') return res.status(401).json({ message: 'Unauthorized' })

    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_SECRET, (err, data) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })

        req.userId = data.userId
        next()
    })
}