const express = require('express')
const { getUsers, register, login, googleLogin } = require('../../controllers/auth.controller')
const router = express.Router()


router.get('/users',getUsers)
router.post('/register',register)
router.post('/login',login)
router.post('/login/google',googleLogin)



module.exports = router