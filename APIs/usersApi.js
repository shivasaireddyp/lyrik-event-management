// creating mini express application

const exp = require('express')
const userApp = exp.Router()
require('dotenv').config()

const expressAsyncHandler = require('express-async-handler')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyToken = require('../APIs/middlewares/verifyToken')

//import multerObj
const multerObj = require('./middlewares/cloudinaryConfig')

// userApp.get('/get-users',expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         //the find method returns a cursor
//         let users = await usersCollection.find().toArray()
//         response.status(200).send({message:"Users Data:",payload:users})
//     }
// ))

// userApp.get('/get-users/:id',expressAsyncHandler(
//     async(request,response)=>{
//         // get userCollection
//         const usersCollection = request.app.get('usersCollection')
//         // get user from request body
//         let userId = (+request.params.id)
//         //save or insert or create newuser in userscollection
//         let user = await usersCollection.findOne({id:userId})
//         response.status(200).send({message:"Users Found:",payload:user})
//     }
// ))

// userApp.use(exp.json())
// userApp.post('/create-user',expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         // get user from the requests
//         const newUser = request.body
//         let result = await usersCollection.insertOne(newUser)
//         response.status(200).send({message:"User Created",payload:result})
//     }
// ))

// userApp.put('/update-user',expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         let modifiedUser = request.body
//         let result = await usersCollection.updateOne({id:modifiedUser.id},{$set:{...modifiedUser}})
//         response.status(200).send({message:"User Updated",payload:result})
//     }
// ))

// userApp.delete('/delete-user/:id',expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         let userId = (+request.params.id)
//         let result = await usersCollection.deleteOne({id:userId})
//         response.status(200).send({message:"User Deleted",payload:result})
//     }
// ))



// User Registration

//body parser
userApp.use(exp.json())

// userApp.get('/get-users',verifyToken,expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         let allUsers = await usersCollection.find().toArray()
//         response.status(200).send({message:"Users data",payload:allUsers})
//     }
// ))

userApp.post('/register-user',multerObj.single('userimage'),expressAsyncHandler(
    async(request,response)=>{
        const usersCollection = request.app.get('usersCollection')
        const newUser = JSON.parse(request.body.user) 
        let result = await usersCollection.findOne({username:newUser.username})
        // console.log(result)
        if(result!==null){
            response.status(200).send({message:"Username already exists"})
        }
        else{
            //add cdn link upload cdn link of cloudinary image to user object
            newUser.image = request.file.path;

            // hash the password before pushing into database
            let hashedPassword = await bcryptjs.hash(newUser.password,5)
            newUser.password = hashedPassword
            // push into database
            await usersCollection.insertOne(newUser)
            // send response
            response.status(201).send({message:"User Registered"})
        }
    }
))

userApp.post('/login-user',expressAsyncHandler(async(request,response)=>{

    //get user collection
    const userCollectionObj=request.app.get("usersCollection")
  
    //get user from client
    const userCredentialsObj=request.body;
  
    //verify username of userCredentialsObj
    let userOfDB=await userCollectionObj.findOne({username:userCredentialsObj.username})
  
    //if username is invalid
    if(userOfDB===null){
      response.status(200).send({message:"Invalid username"})
    }
    //if username is valid
    else{
      //compare passwords
      let isEqual=await bcryptjs.compare(userCredentialsObj.password,userOfDB.password)
      //if passwords not matched
      if(isEqual===false){
        response.status(200).send({message:"Invalid password"})
      }
      //passwords are matched
      else{
        //create JWT token
        let signedJWTToken=jwt.sign({username:userOfDB.username},process.env.SECRET_KEY,{expiresIn:"1d"})
        //send token in response
        response.status(200).send({message:"success",token:signedJWTToken,user:userOfDB})
      }
  
    }
  
  }))

// userApp.delete('/delete-user/:username',expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         let userNameDel = request.params.username
//         let deletedUser = await usersCollection.deleteOne({username:userNameDel})
//         response.status(200).send({message:"User deleted",payload:deletedUser})
//     }
// ))

// userApp.post('/login-user',expressAsyncHandler(
//     async(request,response)=>{
//         const usersCollection = request.app.get('usersCollection')
//         const userCredentials = request.body
//         let userOfDb = await usersCollection.findOne({username:userCredentials.username})
//         if(userOfDb===null){
//             response.send({message:"Invalid username"})
//         }
//         else{
//             // compare passwords
//             if(await bcryptjs.compare(userCredentials.password,userOfDb.password)){
//                 // create JWT token
//                 let signedToken = jwt.sign({username:userOfDb.username},'abcd',{expiresIn:60})
//                 response.send({message:"Login Succesful",payload:signedToken})
 
//             }
//             else{
//                 response.send({message:"Invalid Password"})
//             }
//         }
//     }
// ))

module.exports = userApp