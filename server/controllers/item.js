const Item = require('../models/item')
const Transaction = require('../models/transaction')
const Cart = require('../models/cart')
const moment = require('moment')
const popularitySort = require('../helpers/popularitySort')

class Controller {
    static viewItems(req, res) {
        Item
            .find()
            .then(items => {
                res.status(200).json({ message: "Data retrieved", data: items })
            })
            .catch(err => {
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static viewItemsbyCategory(req, res) {
        Item
            .find({
                category: req.params.categoryId
            })
            .then(items => {
                res.status(200).json({ message: "Data retrieved", data: items })
            })
            .catch(err => {
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static searchItem(req, res) {
        Item
            .find()
            .then(items => {
                const regex = new RegExp(req.query.search, 'i')
                let filtered = items.filter(datum => datum.name.match(regex))
                if(filtered.length === 0) {
                    res.status(400).json({message: "Search not Found"})
                } else {
                    res.status(200).json({ message: "Data retrieved", data: filtered })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static addItem(req, res) {
        //get link for image to be uploaded
        if(req.fileValidationError) {
            res.status(400).json({message: req.fileValidationError})
        } else if (req.file) {
            let image = req.file.cloudStoragePublicUrl
            //check if category inputted exist
            Item
                .create({
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    stock: req.body.stock,
                    category: req.body.category,
                    image: image,
                    popularity: 0
                })
                .then((item) => {
                    res.status(201).json({ message: 'Item succesfully added', data: item })
                })
                .catch(err => {
                    res.status(500).json({ message: err.message, note: "Please see console for details" })
                })
        } else {
            res.status(400).json({ message: "Please upload an image for the new Item" })
        }
    }
    static deleteItem(req, res) {
        Item
            .deleteOne({
                _id: req.params.itemId
            })
            .then(() => {
                //delete item from cart
                return Cart
                        .find({cart: req.params.itemId})
                        .then(data => {
                            data.forEach(datum => {
                                let newCart = datum.cart.filter(item => String(item) != req.params.itemId)
                                datum.cart = newCart
                                datum.save()
                            })
                            res.status(200).json({ message: "Data has been Deleted" })
                        })
            })
            .catch(err => {
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static editItem(req, res) {
        //get link for image to be uploaded
        if(req.fileValidationError) {
            res.status(400).json({message: req.fileValidationError})
        } else if (req.file) {
            let image = req.file.cloudStoragePublicUrl
            //check if category inputted exist
            Item
                .findOneAndUpdate({
                    _id: req.params.itemId
                }, {
                        name: req.body.name,
                        price: req.body.price,
                        description: req.body.description,
                        stock: req.body.stock,
                        category: req.body.category,
                        image: image
                    },{new: true})
                .then((item) => {
                    res.status(201).json({ message: 'Item succesfully edited', data: item })
                })
                .catch(err => {
                    res.status(500).json({ message: err.message, note: "Please see console for details" })
                })
        } else {
            res.status(400).json({ message: "Please upload an image for the edited Item" })
        }
    }
    static viewPopularItems(req, res) {
        let formattedDate = moment(req.query.date).format("MMM D, YYYY")
        //find item List
        Item
            .find()
            .then(items => {
                //get item list only
                let uniqueItems = []
                items.forEach(item => {
                    let obj = {
                        id: item._id,
                        popularity: 0
                    }
                    uniqueItems.push(obj)
                })

                return Transaction
                    .find()
                    // .populate('items')
                    .then(transactions => {
                        //show popularity without date filter
                        if(req.query.date === '') {
                            //add popularity per item based on purcahse history
                            transactions.forEach(transaction => {
                                transaction.items.forEach(item => {
                                    uniqueItems.forEach((uniqueItem,index) => {                    
                                        if(String(item) == uniqueItem.id) {
                                            items[index].popularity += 1
                                        }
                                    })
                                })
                            })
                            //sort DESC
                            let sort = items.sort(popularitySort).filter(item => item.popularity !== 0)
                            res.status(200).json({message: "Data retrieved", data: sort})

                        //show popularity with date filter
                        } else {
                            const regex = new RegExp(formattedDate, 'i')
                            let filteredTransaction = transactions.filter(transaction => transaction.date.match(regex))
                            if(filteredTransaction.length > 0) {
                                //add popularity per item based on purcahse history
                                filteredTransaction.forEach(transaction => {
                                    transaction.items.forEach(item => {
                                        uniqueItems.forEach((uniqueItem,index) => {                    
                                            if(String(item) == uniqueItem.id) {
                                                items[index].popularity += 1
                                            }
                                        })
                                    })
                                })
                                //sort DESC
                                let sort = items.sort(popularitySort).filter(item => item.popularity !== 0)
                                res.status(200).json({message: "Data retrieved", data: sort})
                            } else {
                                res.status(400).json({message: `There are no Transaction(s) on ${formattedDate}`})
                            }
                        }
                    })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }

}

module.exports = Controller