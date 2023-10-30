const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');

//
require('dotenv').config();
//
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {

    console.log('sent by client', req.body);
    const { name, email, password, dob } = req.body;
    if (!email || !password || !name || !dob) {
        return res.status(422).send({ error: 'please fill all the field' });
    }
    User.findOne({ email: email })
        .then(async (savedUser) => {
            if (savedUser) {
                return res.status(422).send({ error: 'email already exit' });
            }
            const user = new User({
                name,
                email,
                password,
                dob
            })
            try {
                await user.save();
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                res.send({ token });
            }
            catch (err) {
                console.log('db err', err)


            }
        })
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: 'please add email or password' })
    }
    const savedUser = await User.findOne({ email: email })

    if (!savedUser) {
        return res.status(422).json({ error: 'Inalid credentials' })
    }
    try {
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                console.log('password matched');
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
                res.send({ token });

            } else {
                console.log('password does not match')
                return res.status(422).json({ error: 'Invalid credentials' })
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})
module.exports = router;