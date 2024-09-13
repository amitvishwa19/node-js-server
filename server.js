require('dotenv').config()
const express = require('express');
const cors = require('cors')
const http = require('http');
const parseUrl = require('body-parser');
const cookieparser = require('cookie-parser')



const port = process.env.PORT || 8000;

const app = express();
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000'],
    methods: ["GET", "POST"]
}))


app.get("/", (req, res) => {
    res.json({ msg: 'ok' })
})

app.listen(port, () => console.log(`server is running on port ${port}`))



console.log("Socketserver running")