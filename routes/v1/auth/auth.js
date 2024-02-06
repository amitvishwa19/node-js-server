const express = require('express')
const { getUsers, register } = require('../../../controllers/user.controller')
const router = express.Router()


router.get('/',getUsers)
router.get('/register',register)




module.exports = router