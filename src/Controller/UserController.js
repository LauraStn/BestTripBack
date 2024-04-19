const { User } = require('../Model/User')
const client = require('../Services/Connexion')
const bcrypt = require('bcrypt')
const { ObjectId } = require('bson')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async (req, res) => {
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.password
    ) {
        res.status(400).json({ error: 'Missing fields' })
        return
    }
    const verifEmail = await client.db('BestTrip')
    .collection('user')
    .findOne({email: req.body.email})

    if(verifEmail){
        res.status(401).json({error: 'Email already used'})
        return
    }
    const hashedPassword = await bcrypt.hash(req.body.password + '', 10)
    try {
        
        let user = new User(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            hashedPassword,
            new Date(),
            new Date(),
            'user'
        )
        let result = await client
            .db('BestTrip')
            .collection('user')
            .insertOne(user)
        res.status(201).json(result)
        return
    } catch (error) {
        res.status(500).json(error)
        return
    }
}

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({ error: 'Missing fields' })
        return
    }

    let user = await client
        .db('BestTrip')
        .collection('user')
        .findOne({ email: req.body.email })

    if (!user) {
        res.status(401).json({ error: 'Wrong credentials' })
        return
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)

    if (!isValidPassword) {
        res.status(401).json({ error: 'Wrong credentials2' })
        return
    } else {
        const token = jwt.sign(
            {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                gdpr: new Date(user.gdpr).toLocaleString('en'),
            },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )

        res.status(200).json({ jwt: token, user:user.lastName })
        return
    }
}

module.exports = { register, login }
