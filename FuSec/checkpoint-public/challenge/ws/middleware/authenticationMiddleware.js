const authenticationMiddleware = (req, res, next) => {
    if (req.originalUrl === '/signin' || req.originalUrl === '/register') {
        return next();
    }

    if (req.session.userId) {
        return next();
    }
    return res.redirect('/signin');
}

module.exports = authenticationMiddleware;