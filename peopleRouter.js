const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");
const Person = require("./PersonModel");


router.get("/", respondWithPeople);
router.get("/:personName", respondWithPerson);
router.put("/:personName/followers", updatePeopleFollowing);
router.post("/", addNewPerson)


async function addNewPerson(req, res){
    // console.log(req.body);
    try{
        if(!req.session.username || !(req.session.user.contributor)){
            res.status(401).send();
        }
    
        else if(await model.addPerson(req.session.username, req.body)){
            res.status(201).send();
        }
    
        else{
            res.status(400).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

}

async function updatePeopleFollowing(req, res){
    try{
        if(req.body.follow == false){
            // console.log("Prior to unfollowing");
            // console.log(model.users[req.session.username].peopleFollowing);
            if(await model.unfollowPerson(req.session.username, req.params.personName)){
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
            if(await model.followPerson(req.session.username, req.params.personName)){
                // console.log("After following");
                // console.log(model.users[req.session.username].peopleFollowing);
                res.status(200).send();
            }
    
            else{
                res.status(400).send();
            }
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

    // next();
}

async function respondWithPerson(req, res){
    try{
        person = await Person.findOne({name:req.params.personName}).lean().populate({path:'movies', select:{"title":1, "_id":0}});
        if(person){
            res.format({"text/html": 
                function(){
                    res.render("pages/person", {username: req.session.username, users:model.users, person: person});
                },
    
                "application/json": 
                function(){
                    res.status(200).json(person);}
                });
        }
        else{
            res.status(404).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

}

async function respondWithPeople(req, res){
    try{
        let results = [];
        if(!req.query.name){
            req.query.name = "";
            results = await Person.find({}).lean().select({"name":1, "_id":0});
            newResults = results.map((obj)=>{return obj.name});
            results = newResults;
        }
    
    
        else{
            results = await Person.find().byUsername(req.query.name).lean().select({"name":1, "_id":0});
            newResults = results.map((obj)=>{return obj.name});
            results = newResults;
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

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

}


module.exports = router;