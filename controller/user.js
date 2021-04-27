const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../model/user')

exports.users_signup_user = (req, res) => {

    userModel
        .findOne({email : req.body.userEmail})
        .then(user => {
            if(user){
                return res.json({
                    msg : "user existed, please other email"
                })
            }
            else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(404).json({
                            msg : err.message
                        })
                    }
                    const newUser = new userModel({
                        name : req.body.userName,
                        email : req.body.userEmail,
                        password : hash
                    })

                    newUser
                        .save()
                        .then(user => {
                            res.json({
                                msg : "registered user",
                                userInfo : user
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                msg : err.message
                            })
                        })
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })


};

exports.users_login_user = (req, res) => {

    const {email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    msg : "user email, please other email"
                })
            }
            else{
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err || isMatch === false){
                        return res.status(402).json({
                            msg : "not match password"
                        })
                    }
                    else{
                        const token = jwt.sign(
                            {id : user._id, email : user.email},
                            process.env.SECRET_KEY,
                            {expiresIn: '1h'}
                        )

                        res.json({
                            msg : 'successful login',
                            userInfo : user,
                            tokenInfo : token
                        })
                    }

                })
            }
        })
        .catch(err => {
            res.status(404).json({
                msg : err.message
            })
        })
};