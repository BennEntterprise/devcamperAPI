const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')

//Route Files
const bootcamps = require('./routes/bootcamps')

// Load/Analyze Environment Variables
dotenv.config({ path: './config/config.env' })
const PORT = process.env.PORT || 5000;
let env;
if (process.env.NODE_ENV === 'production') {
    env = 'production'
} else {
    env = 'development'
}

//connect to DB
connectDB();

//Initailize app. 
const app = express();

//Dev Loggin Middleware
if (env === 'development') {
    app.use(morgan('dev'))
}

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
)



///Handle unhandled Promise Rejections. 
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    //Close Server/Exit Proces
    server.close(() => process.exit(1))
})