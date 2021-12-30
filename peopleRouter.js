const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");


router.get("/", respondWithPeople);
router.get("/:personName", respondWithPerson);
router.put("/:personName/followers", updatePeopleFollowing);
router.post("/", addNewPerson)


function addNewPerson(req, res){
    // console.log(req.body);
    if(!req.session.username || !model.users[req.session.username].contributor){
        res.status(401).send();
    }

    else if(model.addPerson(model.users[req.session.username], req.body)){
        res.status(201).send();
    }

    else{
        res.status(400).send();
    }
}

function updatePeopleFollowing(req, res){
    // console.log(req.body.follow);
    // res.status(200).send();
    if(req.body.follow == false){
        // console.log("Prior to unfollowing");
        // console.log(model.users[req.session.username].peopleFollowing);
        if(model.unfollowPerson(req.session.username, req.params.personName)){
            // console.log("After unfollowing");
            // console.log(model.users[req.session.username].peopleFollowing);
            res.status(200).send();
        }

        else{
            res.status(400).send();
        }
    }

    else if(req.body.follow == true){
        // console.log("Prior to following");
        // console.log(model.users[req.session.username].usersFollowing);
        if(model.followPerson(req.session.username, req.params.personName)){
            // console.log("After following");
            // console.log(model.users[req.session.username].peopleFollowing);
            res.status(200).send();
        }

        else{
            res.status(400).send();
        }
    }
    // next();
}

function respondWithPerson(req, res){
    if(model.isValidPerson(model.people[req.params.personName])){
        res.format({"text/html": renderPersonPage,
                    "application/json": sendPerson});
    }
    else{
        res.status(404).send();
    }
}

function renderPersonPage(req, res){
    res.render("pages/person", {username: req.session.username, users:model.users, person:model.people[req.params.personName]});
}

function sendPerson(req, res){
    res.status(200).json(model.people[req.params.personName]);
}

function respondWithPeople(req, res){
    let results = [];
    if(!req.query.name){
        req.query.name = "";
        results = Object.keys(model.people);
    }

    else{
        results = model.searchPeople(req.query.name);
    }

    if(results.length == 0){
        res.status(404).send();
    }

    else{
        res.format({
        "text/html": function(req,res){
            res.status(200).render("pages/people", {username: req.session.username, people:results});
        }, 
        "application/json":function(req, res){
            res.status(200).json(results);
        }})
    }
}


module.exports = router;