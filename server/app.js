const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const mongodbUri = 'mongodb://@ds151463.mlab.com:51463/shopping-cart'
require('dotenv')
const cors = require('cors')

//routes
const adminRoute = require('./routes/admin')
const registerRoute = require('./routes/registeration')
const itemRoute = require('./routes/item')
const categoryRoute = require('./routes/category')
const cartRoute = require('./routes/cart')
const transactionRoute = require('./routes/transaction')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//connect mongoose
mongoose.connect(mongodbUri,
  {
    useNewUrlParser: true,
    auth: {
      user: process.env.mlab_user,
      password: process.env.mlab_password
    }
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(('You are Mongected'));
});

//path
app.use('/admin', adminRoute)
app.use('/registeration', registerRoute)
app.use('/items', itemRoute)
app.use('/categories', categoryRoute)
app.use('/carts', cartRoute)
app.use('/transactions', transactionRoute)

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})