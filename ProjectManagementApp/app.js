const express = require("express");
const mysql= require("mysql")
const cors = require('cors')
const userRoute =require('./router/users')
const projectRoute =require('./router/project')
const managerRoute =require('./router/manager')


const connection = require('./connection')


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



// const db = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
// })




app.use(express.urlencoded({ extended: false }));

// Signup route
app.use("/user",userRoute)
app.use("/projects",projectRoute)
app.use("/managers",managerRoute)


app.listen(5000,()=>{
    console.log("Server Started");
})