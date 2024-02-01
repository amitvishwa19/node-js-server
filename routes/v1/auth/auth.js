const express = require('express')
const { getUsers, register } = require('../../../controllers/user.controller')
const router = express.Router()


router.get('/users',getUsers)
router.get('/register',register)




module.exports = router