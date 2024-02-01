const User = require('../models/user.model')
const userModel = require('../models/user.model')



const getUsers = async (req, res) => {
    try {

        const users = await User.find().select('-password  -__v  -createdAt -updatedAt');
        return res.status(200).json({ data: users })

    } catch (error) {
            console.log(error.message)
    }
    
}

const register = async (req, res)=>{
    console.log('register')

    res.send('Register')
}

module.exports = { getUsers, register }