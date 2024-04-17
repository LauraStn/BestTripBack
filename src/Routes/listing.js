const express = require('express')
const router = express.Router()
const {
    createListing,
    getAlllistings,
    userListings,
    deleteListing,
    editListing,
    getOneListing,
} = require('../Controller/ListingController')
const { extractToken } = require('../Utils/extractToken')

router.post('/add', createListing)
router.get('/all', getAlllistings)
router.post('/mine', userListings)
router.delete('/delete/:id', deleteListing)
router.patch('/edit/:id', editListing )
router.get('/one/:id', getOneListing)

module.exports = router
