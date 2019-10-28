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
const importData = async (seedType) => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log(`Data Imported...`.green.inverse)
        if(seedType ==='-i'){
            process.exit()
        }
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

//Delete data (unseeder)
const deleteData = async (seedType) => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log(`Data Destoryed...`.red.inverse)
        if(seedType === '-d'){
            process.exit()
        }
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

//Delete then re-import
async function  reseed(seedType){
    deleteData(seedType) 
    importData(seedType)
}

let seedType = process.argv[2];
if ( seedType === '-i') {
    importData(seedType)
} else if (seedType === '-d') {
    deleteData(seedType);
}else if(seedType=== '-r'){
     (async () => await reseed(seedType))
    process.exit();
}