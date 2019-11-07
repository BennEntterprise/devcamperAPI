const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')

//Route Files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

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
app.use(cookieParser())

//Dev Loggin Middleware
if (env === 'development') {
    app.use(morgan('dev'))
}


//File Upload
app.use(fileupload());

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)


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