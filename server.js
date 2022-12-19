const express = require('express');
const session = require("express-session");
const app = express();
const model =  require("./businessLogic.js");

let usersRouter = require("./usersRouter");
let moviesRouter = require("./moviesRouter");
let peopleRouter = require("./peopleRouter");
const mc = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notificaiton = require("./NotificationModel");
const uri = "mongodb+srv://jola:naBEBmgvuZKQBXp0@moviedb.gcazrrx.mongodb.net/?retryWrites=true&w=majority";

featuredMovies = [];

async function main(){
    try{
        mongoose.connect(uri, {useNewUrlParser: true});
        db = mongoose.connection;

        db.on('connected', function() {
            console.log('database is connected successfully');
        });
        db.on('disconnected',function(){
            console.log('database is disconnected successfully');
        })
        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', async function() {
            try{
                featuredMovies = await Movie.find({}).limit(30);

                app.listen(process.env.PORT || 3000);
                console.log("Server listening at http://localhost:3000");
            }

            catch{
                console.log(err.message);
            }

            finally{
                return;
            }
 
        });
    }

    catch{
        console.log(err);
    }

    finally{
        return;
    }
}


main();

app.use(session({secret:"pain"}));
app.set("view engine", "pug");
app.use(express.json());

// app.use("/", function(req, res, next){
    // console.log(req.session);
    // console.log("Request from", req.session.username);
//     next();
// })


app.post("/login", async function(req, res){
    try{
        // user = await User.findOne({username: req.body.username, password: req.body.password}).populate("usersFollowing").populate("peopleFollowing");
        // user = await User.findOne({username:req.body.username, password: req.body.password}).lean()
        // .populate('usersFollowing', 'username').populate('followers', 'username')
        // .populate('peopleFollowing', 'name').populate({path: 'reviews', select:{"_id":0, "reviewer":0}, populate:{path:'movie', select:{"title":1, "_id":0}}})

        user = await model.getUser(req.body.username);
        //Changing array of objects with usernames to array of usernames
        // newUsersFollowing = user.usersFollowing.map(function(userFollowing){
        //     return userFollowing.username;
        // })

        // //Changing array of objects with names to array of names
        // newPeopleFollowing = user.peopleFollowing.map(function(personFollowing){
        //     return personFollowing.name;
        // })

        // user.usersFollowing = newUsersFollowing;
        // user.peopleFollowing = newPeopleFollowing;
        // console.log(user);
        if(user){
            //accessing the password attribute because the findOne method returns {id:, password:}
            passwordObj = await User.findOne({username: req.body.username, password: req.body.password}).select("password");
            password = passwordObj.password;

            if(password === req.body.password){
                req.session.user = user;
                req.session.username = req.session.user.username
                res.status(200).send();
            }
            else{
                res.status(401).send();
            }
          
        }
    
        else{
            res.status(401).send();
        }
    }

    catch{
        console.log(err);
    }

    finally{
        return;
    }

})


app.get("/", renderHome);
app.get("/index.html",renderHome);
app.get("/home", renderHome);
app.get("/contributor-options", renderContributorPage)
app.get("/filter", renderFilterPage)
app.delete("/signOut", function(req,res,next){
    req.session.destroy();
    res.status(200).send();
});
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/people", peopleRouter);

function renderHome(req, res){
    res.status(200).render("pages/home", {username:req.session.username, movies:featuredMovies});
}

function renderContributorPage(req, res){
    res.status(200).render("pages/contributor", {username:req.session.username, movies:featuredMovies});
}

function renderFilterPage(req, res){
    res.status(200).render("pages/filter", {username:req.session.username});
}


