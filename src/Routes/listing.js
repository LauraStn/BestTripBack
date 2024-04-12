const express = require('express')
const router = express.Router()
const {
    createListing,
    getAlllistings,
    userListings,
} = require('../Controller/ListingController')
const { extractToken } = require('../Utils/extractToken')

router.post('/add', createListing)
router.get('/all', getAlllistings)
router.post('/mine', extractToken, userListings)

module.exports = router
