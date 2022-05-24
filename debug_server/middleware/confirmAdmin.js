const confirmAdmin = (req, res, next) => {
    const isAdmin = req.payload.isAdmin;
    if (isAdmin) {
        next();
    } else {
        return res.status(401).json({ title: 'you not admin' });
    }
}

module.exports = confirmAdmin;