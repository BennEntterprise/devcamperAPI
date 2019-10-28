const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')

//Route Files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

// Load/Analyze Environment Variables
dotenv.config({ path: path.resolve(__dirname, './config/config.env') })
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

//INITIALIZE MIDDLEWARES
//
//
//Body Parser Middleware
app.use(express.json())

//Dev Loggin Middleware
if (env === 'development') {
    app.use(morgan('dev'))
}

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler)
const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
)



///Handle unhandled Promise Rejections. 
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    //Close Server/Exit Proces
    server.close(() => process.exit(1))
})