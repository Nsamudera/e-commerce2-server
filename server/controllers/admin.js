const User = require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config()
//helpers
const encrypt = require('../helpers/bcrypt')

class Controller {
    static canProceed(req, res) {
        res.status(200).json({message: `Welcome Admin`, data: req.currentUser.name})
    }
    static viewAdmin(req, res) {
        User
            .find({
                role: "Admin"
            })
            .then(users => {
                res.status(200).json({message: "Data retrieved", users})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err, note: "Please see console for details"})
            })
    }
    static addAdmin(req, res) {
        encrypt(req.body.password)
            .then(hash => {
                //create User in DB
                User
                    .create({
                        name: req.body.name,
                        email: req.body.email,
                        role: "Admin",
                        password: hash,
                    })
                    .then(user => {
                        res.status(201).json({message:"Admin created", data: user})
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ message: err.message, note: 'Please see console log for details' })
                    })
            })
            .catch((msg => {
                res.status(400).json({message: msg})
            }))
    }
    static deleteAdmin(req, res) {
        User
            .deleteOne({
                _id: req.params.id
            })
            .then(() => {
                res.status(200).json({message: "Admin deleted"})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: 'Please see console log for details' })
            })
    }
    static editAdmin(req, res) {
        User
            .findOne({
                _id: req.params.id
            })
            .then(user => {
                return encrypt(req.body.password)
                .then(hash => {
                    user.name = req.body.name,
                    user.email = req.body.email,
                    user.password = hash   
                    return user.save()         
                    .then(() => {
                        res.status(200).json({message: "Admin edited"})
                    })             
                })
            })            
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: 'Please see console log for details' })
            })
    }
}

module.exports = Controller