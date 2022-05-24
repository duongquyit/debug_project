const jwt = require('jsonwebtoken');

const authenToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized());
    }
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ title: 'invalid token' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(400).json({ title: 'token error' });
        }
        req.payload = data;
        next();
    })

}

module.exports = authenToken;