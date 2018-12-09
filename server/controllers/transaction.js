const Transaction = require('../models/transaction')
const Item = require('../models/item')
const Cart = require('../models/cart')
const moment= require('moment')

class Controller {
    static viewTransactions(req, res) {
        Transaction
            .find({
                customerId: req.currentUser._id
            })
            .populate('items')
            .then(transactions => {
                res.status(200).json({message: "Data retrieved", data: transactions})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static addTransaction(req, res) {
        Cart
            .findOne({
                customerId: req.currentUser._id
            })
            .then(cart => {
                //transfer cart data to new Transaction
                return Transaction
                        .create({
                            customerId: req.currentUser._id,
                            items: cart.cart,
                            date: moment().format("MMM D, YYYY")
                        })
                        .then(transaction => {
                            //remove cart
                            return Cart
                                    .findOneAndDelete({
                                        customerId: req.currentUser
                                    })
                                    .then(response => {
                                        res.status(201).json({message: "Transaction created"})
                                    })
                        })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    
}

module.exports = Controller