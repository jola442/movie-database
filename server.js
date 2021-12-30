const express = require('express');
const session = require("express-session");
const app = express();
const model =  require("./businessLogic.js");

let usersRouter = require("./usersRouter");
let moviesRouter = require("./moviesRouter");
let peopleRouter = require("./peopleRouter");

app.use(session({secret:"pain"}));
app.set("view engine", "pug");
app.use(express.json());

// app.use("/", function(req, res, next){
    // console.log(req.session);
    // console.log("Request from", req.session.username);
//     next();
// })


app.post("/login", function(req, res, next){
    if(model.verifyUser(req.body.username, req.body.password)){
        req.session.user = model.users[req.body.username];
        req.session.username = req.session.user.username
        res.status(200).send();
    }

    else{
        res.status(401).send();
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

function renderHome(req, res, next){
    res.status(200).render("pages/home", {username:req.session.username, movies:model.movies});
}

function renderContributorPage(req, res, next){
    res.status(200).render("pages/contributor", {username:req.session.username, movies:model.movies});
}

function renderFilterPage(req, res){
    res.status(200).render("pages/filter", {username:req.session.username});
}


app.listen(process.env.PORT || 3000);
console.log("Server listening at http://localhost:3000");
