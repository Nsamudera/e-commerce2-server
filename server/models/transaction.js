const mongoose = require('mongoose')

const Schema = mongoose.Schema
const transactionSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
		required: true
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
    }],
    date: {
        type: String //using moment.js,
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema, 'Transactions')

module.exports = Transaction