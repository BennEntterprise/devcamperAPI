const fs = require('fs');
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load Env Vars. 
dotenv.config({ path: './config/config.env' })


// Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))

//Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log(`Data Imported...`.green.inverse)
     
        process.exit(0)
   
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

//Delete data (unseeder)
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log(`Data Destoryed...`.red.inverse)
   
        process.exit(0)
      
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}



let seedType = process.argv[2];
if ( seedType === '-i') {
    importData()
} else if (seedType === '-d') {
    deleteData();
}