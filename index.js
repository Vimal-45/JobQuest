import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnection from './DataBase/dbConnection.js'
import router from './Routers/user.router.js'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())


dbConnection()

app.use('/api', router)
app.get('/',(req, res)=>{

    res.send("Backend App working good")

})

app.listen(port, ()=>{
    console.log('The app is listening with PORT:',port);    
})

