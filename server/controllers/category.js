//Model
const Category = require('../models/category.js')
const Item = require('../models/item.js')

class Controller {
    static viewCategory(req, res) {
        Category
            .find()
            .sort(
                {
                    name: 1
                }
            )
            .then(categories => {
                res.status(200).json({message: "Data retrieved", data: categories})
            })
            .catch(err => {
                console.log('err')
                res.status(500).json({message: err.message, note: 'Please see console log for details'})
            })
    }
    static addCategory(req, res) {
        Category
            .create({
                name: req.body.name
            })
            .then(category => {
                res.status(200).json({message: "Category created", data: category})
            })
            .catch(err => {
                console.log('err')
                res.status(500).json({message: err.message, note: 'Please see console log for details'})
            })
    }
    static deleteCategory(req, res) {
        // check if there are items with the category
        Item
            .find({
                category: req.params.categoryId
            })
            .then((data) => {
                //if no items has the category: delete
                if(data.length === 0) {
                    return Category
                                .deleteOne({
                                    _id: req.params.categoryId
                                })
                                .then((data) => {
                                    res.status(200).json({message:"Category deleted"})
                                })
                } else {
                    res.status(400).json({message: 'Please make sure all items with that category has been edited or removed!'})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message, note: 'Please see console log for details'})
            })
    }
    static editCategory(req, res) {
        // check if there are items with the category
        Item
            .find({
                category: req.params.categoryId
            })
            .then((data) => {
                //if no items has the category: delete
                if(data.length === 0) {
                    return Category
                                .findOne({
                                    _id: req.params.categoryId
                                })
                                .then((category) => {
                                    category.name = req.body.name
                                    return category.save()
                                    .then(() => {
                                        res.status(200).json({message:"Category edited"})
                                    })
                                })
                } else {
                    res.status(400).json({message: 'Please make sure all items with that category has been edited or removed!'})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message, note: 'Please see console log for details'})
            })
    }
}

module.exports = Controller