function isAdmin(req, res, next) {
    if(req.currentUser.role === "Admin") {
        next()
    } else {
        res.status(401).json({message: "Only Admin is allowed beyond this point"})
    }
}

module.exports = isAdmin