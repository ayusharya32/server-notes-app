const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const notesRoute = require('./routes/notes')

dotenv.config({ path: './config/config.env' })
const app = express()

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/notes", notesRoute)

connectDbAndServer()

async function connectDbAndServer() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,
             {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
        
        console.log('MongoDB Connected');
        app.listen(process.env.PORT, () => console.log('Server listening on PORT ' + process.env.PORT))
    } catch(err) {
        console.log(`Error connecting MongoDB: ${err}`);
    } 
}