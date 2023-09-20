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
    try{
        console.log("add person")
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
        console.log(req.body.follow);
        if(req.body.follow == false){
            // console.log("Prior to unfollowing");
            // console.log(model.users[req.session.username].peopleFollowing);
            if(await model.unfollowPerson(req.body.loggedInUser, req.params.name)){
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
            if(await model.followPerson(req.body.loggedInUser, req.params.name)){
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
        const person = await Person.findOne({name:req.params.name}).lean()
        .populate({path:'movies', select:{"title":1, "poster":1, "_id":0}}).populate({path: 'collaborators', select:{"_id":0}})

        console.log("Person found:",person);
  
        // let mostFrequentCollaborators = await model.getMostFrequentCollaborators(person)/*.entries();*/

        // if(mostFrequentCollaborators.length > 5){
        //     mostFrequentCollaborators = mostFrequentCollaborators.slice(0,5)
        // }
        // console.log("Most Frequent Collaborators", mostFrequentCollaborators);
        if(person){
            res.status(200).json(person);
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
    let pageCount = 1;
    let numResults = 0;
    try{
        queryObject = req.query;
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
            results = await Person.find({}).populate({path:'movies', select:{"title":1, "_id":0}});
                            //.limit(ENTRIES_PER_PAGE).skip((req.query.page-1)*ENTRIES_PER_PAGE);
        }
    
    
        else{
            console.log(req.query.name);
            results = await Person.find().byName(req.query.name).populate({path:'movies', select:{"title":1, "_id":0}});//.limit(ENTRIES_PER_PAGE).skip((req.query.page-1)*ENTRIES_PER_PAGE).lean().select({"name":1, "_id":0});
        }

        numResults = results.length;
  
       

 
        
        if(results.length >= ENTRIES_PER_PAGE){
            pageCount = Math.floor(numResults/ENTRIES_PER_PAGE);
            results = results.slice((req.query.page-1)*ENTRIES_PER_PAGE, (req.query.page-1)*ENTRIES_PER_PAGE + ENTRIES_PER_PAGE);
        }
        
        results.push({pageCount});
    
        if(results.length == 0){
            res.status(404).send();
        }
    
        else{
            res.status(200).json(results);
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