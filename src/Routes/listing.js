const express = require('express')
const router = express.Router()
const {
    createListing,
    getAlllistings,
    userListings,
    deleteListing,
    editListing,
    getOneListing,
    participate,
} = require('../Controller/ListingController')
const { extractToken } = require('../Utils/extractToken')

router.post('/add', createListing)
router.get('/all', getAlllistings)
router.get('/mine', userListings)
router.delete('/delete/:id', deleteListing)
router.patch('/edit/:id', editListing )
router.get('/one/:id', getOneListing)
router.patch('/join/:id', participate)

module.exports = router
