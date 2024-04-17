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
    }
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=>{
        if (error) {
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
            res.status(401).json({ error: 'Unauthorized1' })
            return
        } else {
            let listings = await client
                .db('BestTrip')
                .collection('listing')
                .find({ userId: data.id })
            let result = await listings.toArray()

            res.status(200).json(result)
           
        }
    })
}
const deleteListing = async (req, res) => {
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=> {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
            console.log('unauthorized');
            return
        } else {
                const listing = await client
                  .db('BestTrip')
                  .collection('listing')
                  .findOne({_id: new ObjectId(req.params.id)});

                const user = await client
                  .db('BestTrip')
                  .collection('user')
                  .findOne({_id: new ObjectId(data.id)})
               
                if (!user || !listing) {
                    res.status(401).json({ error: 'Does not exist' })
                    console.log('does not exist');
                    return
                }
            
                if (listing.userId + '' !== user._id + '') {
                    res.status(401).json({ error: 'Not matched' })
                    console.log('not matched');
                    return
                }
               
                try {
                    await client
                    .db('BestTrip')
                    .collection('listing')
                    .deleteOne({_id: new ObjectId(req.params.id)});
                    res.status(200).json("Deleted successfull !")
                    console.log('deleted');
                  return;
                }
                 catch (error) {
                    res.status(400).json('does not work mothafucker')
                }
               
            }     
        
    })
}
const getOneListing = async  (req, res) => {
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=> {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
            console.log('non !');
            return
        }else {
            try {
                const listing = await client
                  .db('BestTrip')
                  .collection('listing')
                  .findOne({_id: new ObjectId(req.params.id)});
                
                  const user = await client
                  .db('BestTrip')
                  .collection('user')
                  .findOne({_id: new ObjectId(data.id)})  
        
                  if (!user || !listing) {
                    res.status(401).json({ error: 'Does not exist' })
                    console.log('edit does not exist');
                    return
                }
            
                if (listing.userId + '' !== user._id + '') {
                    res.status(401).json({ error: 'Not matched' })
                    console.log('edit not matched');
                    return
                }
                console.log('edit all good')
                res.status(200).json(listing)
                console.log('send');

            } catch (error) {
                res.status(400).json('edit not good')
            }
            
        }
    })
}

const editListing = async (req, res) => {
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=> {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
        
            return
        } else {
            const image = req.body.image;
            const description = req.body.description;
            const title = req.body.title;
            const eventDate = req.body.eventDate;
            const place = req.body.place;
            const maxParticipant = req.body.maxParticipant;


                const listing = await client
                  .db('BestTrip')
                  .collection('listing')
                  .findOne({_id: new ObjectId(req.params.id)});

                const user = await client
                  .db('BestTrip')
                  .collection('user')
                  .findOne({_id: new ObjectId(data.id)})
               
                if (!user || !listing) {
                    res.status(401).json({ error: 'Does not exist' })
                    console.log('does not exist');
                    return
                }
            
                if (listing.userId + '' !== user._id + '') {
                    res.status(401).json({ error: 'Not matched' })
                    console.log('not matched');
                    return
                }
                console.log('all good')
                try {
                    await client
                    .db('BestTrip')
                    .collection('listing')
                    .updateOne(
                        {_id: new ObjectId(req.params.id)},
                        { $set: {place: place, image: image, title: title, maxParticipant: maxParticipant, eventDate: eventDate,description: description, } }
                      )
                      if (place == "") {
                        listing.place = listing.place;
                      }
                      if (description == "") {
                        listing.description = listing.description;
                      }
                      if (image == "") {
                        listing.image = listing.image;
                      }
                      if (title == "") {
                        listing.title = listing.title;
                      }
                      if (maxParticipant == "") {
                        listing.maxParticipant = listing.description;
                      }
                      if (eventDate == "") {
                        listing.eventDate = listing.eventDate;
                      }
                      
                    res.status(200).json("Edit successfull !")
                  return;
                }
                 catch (error) {
                    res.status(400).json('does not work mothafucker')
                }
               
            }     
        
    })
}
module.exports = { createListing, getAlllistings, userListings, deleteListing, editListing, getOneListing }
