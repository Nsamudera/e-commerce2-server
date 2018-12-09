const Item = require('../../models/item')

function isItemExit(req, res, next) {
    Item
        .findOne({
            _id: req.params.itemId
        })
        .then(item => {
            if(item) {
                next()
            } else {
                res.status(400).json({message: "Item not found"})
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message, note: "Please see console for details"})
        })
}

module.exports = isItemExit