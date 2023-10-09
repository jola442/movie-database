const express = require('express');
// const session = require("express-session");
const path = require('path');
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
const cors = require('cors');

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

                app.listen(process.env.PORT || 5000);
                console.log("Server listening at http://localhost:5000");
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

// app.use(session({secret:"pain"}));

app.use(express.json());
app.use(cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use("/", function(req, res, next){
    // console.log(req.session);
    // console.log("Request from", req.session.username);
//     next();
// })


app.post("/login", async function(req, res){
    User.findOne({username:req.body.username})
    .populate('usersFollowing', 'username').populate('followers', 'username')
    .populate('peopleFollowing', 'name').populate({path: 'reviews', select:{"_id":0, "reviewer":0}, populate:{path:'movie', select:{"title":1, "_id":0}}})
    .exec( function(err, user){
        if(err) throw err;

        if(user){
            user.comparePassword(req.body.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    user = user.toObject();
                    newUsersFollowing = user.usersFollowing.map((usr)=> {return usr.username});
                    newFollowers = user.followers.map((usr)=> {return usr.username});
                    newPeopleFollowing = user.peopleFollowing.map((p)=> {return p.name});
                    user.usersFollowing = newUsersFollowing;
                    user.peopleFollowing = newPeopleFollowing;
                    user.followers = newFollowers;
                    delete user.password;
                    delete user.id;
                    console.log(user)
                    res.status(200).send(JSON.stringify(user));

                }
    
                else{
                    res.status(401).send();
                }
            })
        
        }

        else{
            res.status(401).send();
        }
        })

    
})


// app.delete("/signOut", function(req,res,next){
//     req.session.destroy();
//     res.status(200).send();
// });

app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/people", peopleRouter);


