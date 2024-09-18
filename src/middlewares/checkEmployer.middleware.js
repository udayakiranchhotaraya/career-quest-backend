function checkEmployer(req, res, next) {
    if (!req.user || !req.user.isEmployer) {
        return res.status(403).json({ "message": "Access denied. Only employers can access this route." });
    }
    next();
}

module.exports = checkEmployer;