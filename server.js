const exp = require('express')
const app = exp()
// console.log(app)
app.listen(4000,()=>console.log("server started on port 4000"))

const path=require("path")
//connect express with react build
app.use(exp.static(path.join(__dirname,'./build')))

// get mongo client
const mclient = require('mongodb').MongoClient
// console.log(mclient)

//connect to MongoDB server
mclient.connect('mongodb://127.0.0.1:27017/emsdb')
.then(dbRef=>{
    //get database obj
    let dbObj = dbRef.db('emsdb')
    let usersCollection = dbObj.collection("userscollection")
    // let productsCollection = dbObj.collection("productscollection")
    let audisCollection = dbObj.collection("audiscollection")
    
    //share collection objs to API
    app.set("usersCollection",usersCollection)
    // app.set("productsCollection",productsCollection)
    app.set("audisCollection",audisCollection)
    console.log("Data base conn succesful")
})
.catch(err=>console.log("An error is occured",err))


// importing apis
const usersApp = require("./APIs/usersApi")
const audisApp = require("./APIs/audisApi")
// const productsApp = require("./APIs/productsApi")

// forwarding requests to apis
app.use('/users-api',usersApp)
app.use('/audis-api',audisApp)
// app.use('/products-api',productsApp)

//middlware to deal with page refresh
const pageRefresh=(request,response,next)=>{
    response.sendFile(path.join(__dirname,'./build/index.html'))
}

app.use("/*",pageRefresh)

const invalidPathMiddleware=(request,response,next)=>{
    response.send({message:"Invalid url check again!, verify again"})
    // console.log(response)
    console.log("invalid paths handled")
    next()
}

app.use(invalidPathMiddleware)

const errorHandlingMiddleware=(error,request,response,next)=>{
    response.send({"error-message":error.message})
    console.log("errors handled here")
    next()
}

app.use(errorHandlingMiddleware)