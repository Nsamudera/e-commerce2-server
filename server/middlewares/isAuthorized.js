
function isAuthorized(req, res, next) {
    if(req.params.id == req.currentUser._id) {
        next()
    } else {
        res.status(401).json({message: "You are not the owner"})
    }
}

module.exports = isAuthorized