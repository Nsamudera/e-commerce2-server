const mongoose = require('mongoose')
const Cart = require('../models/cart.js')
const User = require('../models/user.js')
const Item = require('../models/item')

class Controller {
    static getCart(req, res) {
        Cart
            .find({
                customerId: req.currentUser._id
            })
            .populate('cart')
            .then(carts => {
                res.send(carts)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static addtoCart(req, res) {
        Cart
            .findOne({
                customerId: req.currentUser._id
            })
            .then(cart => {
                if(cart) {
                    req.body.itemId.forEach(item => {
                        cart.cart.push(mongoose.Types.ObjectId(item))                        
                    });
                    return cart.save()
                                .then(response => {
                                    res.status(200).json({message: "Item Added"})
                                })
                //cart is null
                } else {
                     return Cart
                            .create({
                                customerId: req.currentUser._id,
                                cart: req.body.itemId
                            })
                            .then(response => {
                                res.status(201).json({message :"Cart Created", data: response})
                            })       
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static checkout(req, res) {
        const { currentUserCart } = req.body;
        let promiseArray = []
        currentUserCart.forEach(item => {
            let promise = 
                Item
                .findOne({
                    _id: item._id
                })
                .then(itemDB => {
                    itemDB.stock = itemDB.stock - item.qty
                    if (itemDB.stock < 0) {
                        res.status(400).json({message: 'Purchase request beyond current Stock'})
                    } else {
                        itemDB.save()
                    }

                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json({message: err.message})
                })
            
            promiseArray.push(promise)
        })
        Promise
            .all(promiseArray)
            .then(response => {
                res.status(200).json({message: "Checkout Complete"})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
    static removefromCart(req, res) {
        Cart
            .findOne({
                _id: req.params.cartId
            })
            .then(cart => {
                if(cart) {
                    let filteredCart = cart.cart.filter(item => item != req.params.itemId)
                        cart.cart = filteredCart
                        return cart
                                .save()
                                .then(response => [
                                    res.status(200).json({message: "Item removed from cart"})
                                ])
                } else {
                    res.status(400).json({message: "Cart not Found"})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
}

module.exports = Controller