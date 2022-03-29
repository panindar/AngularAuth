const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const User = require('../models/users')

const db = "mongodb+srv://pani123:pani123@panindar.huxx7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(db, err => {
    if (err) {
        console.error(err.message)
    } else {
        console.log('Mongodb connected...')
    }
});
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('unauthorizied request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token !== null) {
        return res.status(401).send('unauthorized Request')
    }
    let payload = jwt.verify(token, 'secret');
    if (!payload) {
        return res.status(401).send('unauthorized request')
    }
    req.userId = payload.subject;
    next()
}
router.post('/register', async (req, res) => {
    let userData = req.body;
    
    const { email, password } = userData;
    
    let user = await User.findOne({ email });

    if (user) {
        res.status(401).send('User already exists with this email id ')
    } else {
        user = new User(userData)
        user.save((error, registeredData) => {
            if (error) {
                console.log(error)
            } else {
                let payload = { subject: registeredData._id }
                let token = jwt.sign(payload, 'secret', { expiresIn: 3600 });
                res.status(200).send({token})
            }
        })


    }
   
    
})
router.post('/login', async (req, res) => {
    
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });

    if (!user) {
        res.status(401).send('User doesnot exist');
    } else {
        if (password !== user.password) {
            res.status(401).send('passwords does not match');
        } else {
            let payload = { subject: user._id }
            let token = jwt.sign(payload, 'secret', { expiresIn: 3600 });
            res.status(200).send({token})
        }
    }
});
router.get('/routes', (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": 'Auto expo project',
            "description": "it is a auto expo held in iit delhi in 2022 which is a very high level competetion",
            "date": "12-04-2022 fri 12:30 PM"
            
        },
        {
            "_id": "2",
            "name": 'Technology expo project',
            "description": "it is a auto expo held in iit kolkataa in 2022 which is a very high level competetion",
            "date": "15-06-2022 fri 12:30 PM"
            
        },
        {
            "_id": "3",
            "name": 'viveca expo project',
            "description": "it is a auto expo held in iit mumbai in 2022 which is a very high level competetion",
            "date": "31-04-2022 fri 12:30 PM"
            
        }
    ]
    res.json(events)
});
router.get('/special', verifyToken, (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": 'Auto expo project',
            "description": "it is a auto expo held in iit delhi in 2022 which is a very high level competetion",
            "date": "12-04-2022 fri 12:30 PM"
            
        },
        {
            "_id": "2",
            "name": 'inter expo project',
            "description": "it is a auto expo held in iit delhi in 2022 which is a very high level competetion",
            "date": "12-04-2022 fri 12:30 PM"
            
        },
        {
            "_id": "3",
            "name": 'quater expo project',
            "description": "it is a auto expo held in iit delhi in 2022 which is a very high level competetion",
            "date": "12-04-2022 fri 12:30 PM"
            
        }
    ]
    res.json(events)
})
router.get('/', (req, res) => {
    res.send('From Api route');
});

module.exports = router;