const Category = require('../../models/category')

function isCategoryExist (req, res, next) {
    Category
        .findOne({
            _id: req.params.categoryId
        })
        .then(category => {
            if(category) {
                next()
            } else {
                res.status(400).json({message: "Category not found"})
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message, note: "Please see console for details"})
        })
}
module.exports = isCategoryExist