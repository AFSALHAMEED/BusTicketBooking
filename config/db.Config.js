const mongoose =require('mongoose')

mongoose.connect(process.env.mongo_url)

const db = mongoose.connection

db.on("connected",()=>{
    console.log("connected successfuly");
})

db.on("error",()=>{
    console.log("connection failed");
})