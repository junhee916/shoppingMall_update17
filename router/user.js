const express = require('express')
const userModel = require('../model/user')
const router = express.Router()

// 회원가입
router.post("/", (req, res) => {

    const newUser = new userModel({
        name : req.body.userName,
        email : req.body.userEmail,
        password : req.body.psd
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

// 로그인
module.exports = router