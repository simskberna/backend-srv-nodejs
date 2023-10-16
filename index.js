const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();

app.get('/endpoint-1', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Endpoint  1 is working...'
        }
    })
})

app.get('/endpoint-2', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Endpoint  2 is working...'
        }
    })
})
const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server is running on this port ${PORT}`))