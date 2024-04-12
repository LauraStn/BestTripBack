const { Listing } = require('../Model/Listing')
const client = require('../Services/Connexion')
const { ObjectId } = require('bson')
const jwt = require('jsonwebtoken')
const { extractToken } = require('../Utils/extractToken')
require('dotenv').config()

const createListing = async (req, res) => {
    if (
        !req.body.title ||
        !req.body.description ||
        !req.body.maxParticipant ||
        !req.body.eventDate
    ) {
        res.status(400).json({ error: 'Missing fields' })
    }

    try {
        let listing = new Listing(
            req.body.userId,
            req.body.title,
            req.body.description,
            req.body.image,
            0,
            req.body.maxParticipant,
            req.body.eventDate
        )

        let result = await client
            .db('BestTrip')
            .collection('listing')
            .insertOne(listing)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAlllistings = async (req, res) => {
    try {
        let listings = await client.db('BestTrip').collection('listing').find()
        let result = await listings.toArray()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const userListings = async (req, res) => {
    const token = await extractToken(req)

    jwt.verify(token, process.env.SECRET_KEY, async (error, authData) => {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        } else {
            let listings = await client
                .db('BestTrip')
                .collection('listing')
                .find({ userId: authData.id })
            let result = await listings.toArray()

            res.status(200).json(result)
        }
    })
}
const deleteListing = async (req, res) => {}
module.exports = { createListing, getAlllistings, userListings }
