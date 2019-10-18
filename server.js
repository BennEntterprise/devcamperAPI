const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
//Route Files
const bootcamps = require('./routes/bootcamps')

// Load env vars
dotenv.config({ path: './config/config.env' })

//Initailize app. 
const app = express();

//Applying Middleware
app.use(logger);

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;
let env;
if (process.env.NODE_ENV === 'production') {
    env = 'production'
} else {
    env = 'development'
}

app.listen(PORT, console.log(`Server running in ${
    process.env.NODE_ENV
    } on port ${PORT}`))
