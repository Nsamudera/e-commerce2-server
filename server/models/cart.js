const mongoose = require('mongoose')

const Schema = mongoose.Schema
const cartSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
		required: true
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
	}]
})

const Cart = mongoose.model('Cart', cartSchema, 'Carts')

module.exports = Cart