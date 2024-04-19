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
        return
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
                Number(req.body.maxParticipant),
                req.body.eventDate,
                req.body.place,
            )
    
            let result = await client
                .db('BestTrip')
                .collection('listing')
                .insertOne(listing)
            res.status(201).json(result)
            return
        } catch (error) {
            res.status(500).json({error: "error 500"})
            return
        }
    }
})
  }  


const getAlllistings = async (req, res) => {
    try {
        let listings = await client.db('BestTrip').collection('listing').find()
        let result = await listings.toArray()
        res.status(200).json(result)
        return
    } catch (error) {
        res.status(500).json(error)
        return
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
            return
        }
    })
}

const deleteListing = async (req, res) => {
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=> {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
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
                    return
                }
            
                if (listing.userId + '' !== user._id + '') {
                    res.status(401).json({ error: 'Not matched' })
                    return
                }
               
                try {
                    await client
                    .db('BestTrip')
                    .collection('listing')
                    .deleteOne({_id: new ObjectId(req.params.id)});
                    res.status(200).json("Deleted successfull !")
                  return;
                }
                 catch (error) {
                    res.status(400).json('does not work mothafucker')
                    return
                }
               
            }     
        
    })
}

const getOneListing = async  (req, res) => {
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=> {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
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
                    return
                }
            
                if (listing.userId + '' !== user._id + '') {
                    res.status(401).json({ error: 'Not matched' })
                    return
                }
                res.status(200).json(listing)
                return

            } catch (error) {
                res.status(400).json('edit not good')
                return
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
            if (
                !req.body.title ||
                !req.body.description ||
                !req.body.maxParticipant ||
                !req.body.eventDate ||
                !req.body.place
            ) {
                res.status(400).json({ error: 'Missing fields' })
                return
            }
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
                    return
                }
            
                if (listing.userId + '' !== user._id + '') {
                    res.status(401).json({ error: 'Not matched' })
                    return
                }
                try {
                    const result = await client
                    .db('BestTrip')
                    .collection('listing')
                    .updateOne(
                        {_id: new ObjectId(req.params.id)},
                        { $set: {place: place, image: image, title: title, maxParticipant: maxParticipant, eventDate: eventDate,description: description, } }
                      )
                      
                    res.status(200).json(result)
                    return;
                }
                 catch (error) {
                    res.status(400).json('does not work mothafucker')
                    return
                }
               
            }     
        
    })
}

const participate = async (req, res) => {
    const token = await extractToken(req)
    jwt.verify(token, process.env.SECRET_KEY, async (error, data)=> {
        if (error) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        } else {
            // const participant = req.body.participant;

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
                return
            }
            if(listing.participant === listing.maxParticipant){
                res.status(401).json({success:false,msg:"Event full"})
                return
            }
            try {
                await client
                .db('BestTrip')
                .collection('listing')
                .updateOne(
                    {_id: new ObjectId(req.params.id)},
                    { $set: {participant: listing.participant+1  }}
                  )
                  
                res.status(200).json({success:true,msg:'Join successfull !'})
                return;
            }
             catch (error) {
                res.status(400).json('does not join')
                return
            }

        } 
    })
}
module.exports = { createListing, getAlllistings, userListings, deleteListing, editListing, getOneListing, participate }
