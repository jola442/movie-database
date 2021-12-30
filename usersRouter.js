const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");

router.post("/", createUser);
router.get("/", respondWithUsers);
router.get("/:username", respondWithUser);
router.put("/:username/followers", updateUsersFollowing);
router.put("/:username/accountType", updateAccountType);
router.put("/:username/notifications", updateNotifications)

function createUser(req, res){
    // console.log(req.body);
    if(model.createUser(req.body)){
        // console.log("works");
        req.session.user = model.users[req.body.username];
        req.session.username = req.session.user.username;
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}

function updateNotifications(req, res){
    let results = [];
    if(!req.session.username){
        res.status(200).send();
       return; 
    }
    while(model.users[req.session.username].notifications.length != 0){
        results.push(model.users[req.params.username].notifications.pop());
    }
    res.status(200).send(JSON.stringify(results));
       
}

function updateAccountType(req, res){
    model.users[req.params.username].contributor = !model.users[req.params.username].contributor;
    res.status(200).send();
}

function updateUsersFollowing(req, res){
    if(req.body.follow == false){
        if(model.unfollowUser(req.session.username, req.params.username)){
            // console.log(model.users[req.session.username].usersFollowing);
            res.status(200).send();
        }

        else{
            res.status(400).send();
        }
    }

    else if(req.body.follow == true){
        if(model.followUser(req.session.username, req.params.username)){
            // console.log("After following");
            // console.log(model.users[req.session.username].usersFollowing);
            res.status(200).send();
        }

        else{
            res.status(400).send();
        }
    }
}

function respondWithUser(req, res){
    if(model.isValidUser(model.users[req.params.username])){
        res.format({"text/html": renderUserPage,
                    "application/json": sendUser});
    }
    else{
        res.status(404).send();
    }
}

function renderUserPage(req, res){
    res.status(200).render("pages/user", {username:req.session.username, users:model.users, user:model.users[req.params.username], reviews:model.reviews})
}


function sendUser(req, res){
    res.status(200).json(model.users[req.params.username]);
}


function respondWithUsers(req, res){
    let results = [];
    if(!req.query.name){
        req.query.name = "";
        results = Object.keys(model.users);
    }

    else{
        results = model.searchUsers(req.query.name);
    }

    if(results.length == 0){
        res.status(404).send();
    }

    else{
        res.format({
        "text/html": function(req,res){
            res.status(200).render("pages/users", {username: req.session.username, users:results});
        }, 
        "application/json":function(req, res, next){
            res.status(200).json(results);
        }})
    }
}

module.exports = router;