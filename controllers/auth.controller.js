const User = require('../models/user.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



const getUsers = async (req, res) => {
    try {

        const users = await User.find().select('-password  -__v  -createdAt -updatedAt');
        return res.status(200).json({ data: users })

    } catch (error) {
        console.log(error.message)
    }

}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;


        if (!(email && password)) {
            res.send({ status: 400, message: 'email and password is required' })
        }


        const userExists = await User.findOne({ email });
        if (userExists) { res.send({ status: 401, message: 'user already exists' }) }


        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ username, email, password: hashedPassword })


        const token = jwt.sign(
            { id: user._id, email },
            process.env.APP_SECRET,
            {
                expiresIn: '2hr'
            }
        )

        const refreshToken = jwt.sign(
            { id: user._id, email },
            process.env.APP_SECRET,
            {
                expiresIn: '2hr'
            }
        )


        user.accessToken = token
        user.refreshToken = refreshToken
        user.passwword = undefined




        res.status(201).json(user)


    } catch (error) {
        res.send({ status: 500, message: error.message })
    }
}


const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!(email && password)) {
            res.send({ status: 400, message: 'email and password is required' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            res.send({ status: 400, message: 'user not found' })
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign(
                { id: user._id, email },
                process.env.APP_SECRET,
                {
                    expiresIn: '2hr'
                }
            )

            user.accessToken = accessToken
            user.passwword = undefined


            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.status(201).cookie('accessToken', accessToken, option).json({
                success: true,
                accessToken: accessToken,
                user: user
            })

            return res.send()
        }


        res.send({ status: 401, message: 'invalid credentials' })

    } catch (error) {
        res.send({ status: 500, message: error.message })
    }
}

const googleLogin = async (req, res) => {


}



module.exports = { getUsers, register, login, googleLogin }