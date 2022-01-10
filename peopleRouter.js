const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");
const Person = require("./PersonModel");
ENTRIES_PER_PAGE = 50;


router.get("/", respondWithPeople);
router.get("/:name", respondWithPerson);
router.put("/:name/followers", updatePeopleFollowing);
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
            if(await model.unfollowPerson(req.session.username, req.params.name)){
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
            if(await model.followPerson(req.session.username, req.params.name)){
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
        person = await Person.findOne({name:req.params.name}).lean().populate({path:'movies', select:{"title":1, "_id":0}});
        if(person){
            res.format({"text/html": 
                function(){
                    res.render("pages/person", {username: req.session.username, user:req.session.user, person: person});
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
        try{
            req.query.page = req.query.page || 1;
            req.query.page = Number(req.query.page);
            if(req.query.page < 1){
                req.query.page = 1;
            }
        }catch{
            req.query.page = 1;
        }


        if(!req.query.name){
            req.query.name = "";
            results = await Person.find({}).
                            populate({path:'movies', select:{"title":1, "_id":0}}).
                            limit(ENTRIES_PER_PAGE).skip((req.query.page-1)*ENTRIES_PER_PAGE);
        }
    
    
        else{
            results = await Person.find().ByName(req.query.name).
                            populate({path:'movies', select:{"title":1, "_id":0}}).
                            limit(ENTRIES_PER_PAGE).
                            skip((req.query.page-1)*ENTRIES_PER_PAGE);
        }
       
        queryObject = req.query;
 
        
        if(results.length >= ENTRIES_PER_PAGE){
            queryObject["hasNext"] = true;
        }
    
        else{
            queryObject["hasNext"] = false;
        }
    
        if(results.length == 0){
            res.status(404).send();
        }
    
        else{
            res.format({
            "text/html": function(req,res){
                res.status(200).render("pages/people", {qObj:queryObject, username: req.session.username, people:results});
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