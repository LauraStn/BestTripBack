const { Listing } = require('../Model/Listing')
const client = require('../Services/Connexion')
const { ObjectId, Long } = require('bson')
const jwt = require('jsonwebtoken')
const { extractToken } = require('../Utils/extractToken')
require('dotenv').config()

const createListing = async (req, res) => {
    if (
        !req.body.title ||
        !req.body.description ||
        !req.body.maxParticipant ||
        !req.body.eventDate ||
        !req.body.place
    ) {
        res.status(400).json({ error: 'Missing fields' })
        console.log('Missing fields');
    }
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=>{
        if (error) {
            console.log(error)
            res.status(401).json({ error: 'Unauthorized' })
            return
    } else {
        try {
            let listing = new Listing(
                data.id,
                req.body.title,
                req.body.description,
                req.body.image,
                0,
                req.body.maxParticipant,
                req.body.eventDate,
                req.body.place,
            )
    
            let result = await client
                .db('BestTrip')
                .collection('listing')
                .insertOne(listing)
            res.status(201).json(result)
            console.log(data.id);
        } catch (error) {
            res.status(500).json(error)
            console.log('Error 500');
        }
    }
})
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

    jwt.verify(token, process.env.SECRET_KEY, async (error, data) => {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
            console.log(data.id);
            return
        } else {
            let listings = await client
                .db('BestTrip')
                .collection('listing')
                .find({ userId: data.id })
            let result = await listings.toArray()

            res.status(200).json(result)
            console.log(result);
        }
    })
}
const deleteListing = async (req, res) => {}
module.exports = { createListing, getAlllistings, userListings }
