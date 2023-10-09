const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");
const User = require("./UserModel");
ENTRIES_PER_PAGE = 50;

router.post("/", createUser);
router.get("/", respondWithUsers);
router.get("/:username", respondWithUser);
router.put("/:username/followers", updateUsersFollowing);
router.put("/:username/accountType", updateAccountType);
router.put("/:username/notifications", updateNotifications)

async function createUser(req, res){
    console.log(req.body);
    try{
        newUser = await User.findOne({username:req.body.username});
        if(newUser){
            console.log("Could not add user");
            res.status(400).send();
        }

        else{
            newUser = await User.create(req.body);
            res.status(201).send();
        }

    }   

    catch{
        console.log(err);
        res.status(400).send();
    }

    finally{
        return;
    }

}

function updateNotifications(req, res){
    // let results = [];
    // if(!req.session.username){
    //     res.status(200).send();
    //    return; 
    // }
    // while(model.users[req.session.username].notifications.length != 0){
    //     results.push(model.users[req.params.username].notifications.pop());
    // }
    // res.status(200).send(JSON.stringify(results));
       
}

async function updateAccountType(req, res){
    try{
        if(await model.changeAccountType(req.params.username)){
            let user = await model.getUser(req.params.username);
            console.log("After changing account type", user);
            res.status(200).send(user);
        }
    
        else{
            res.status(304).send();
        }
    }

    catch{
        console.log(err);
    }

    finally{
        return;
    }

}

async function updateUsersFollowing(req, res){
    console.log("SERVER: updateUsersFollowing called");
    console.log("request body:",req.body);
    console.log("request parameters:", req.params);
    try{
        if(req.body.follow == false){
            success = await model.unfollowUser(req.body.loggedInUser, req.params.username)
            if(success){
                res.status(200).send();
            }
    
            else{
                res.status(304).send();
            }
        }
    
        else if(req.body.follow == true){
            success = model.followUser(req.body.loggedInUser, req.params.username);
            if(success){
                res.status(200).send();
            }
    
            else{
                res.status(304).send();
            }
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }


}

async function respondWithUser(req, res){

    try{
        // user = await User.findOne({username:req.params.username}).lean()
        // .populate('usersFollowing', 'username').populate('followers', 'username')
        // .populate('peopleFollowing', 'name').populate({path: 'reviews', select:{"_id":0, "reviewer":0}, populate:{path:'movie', select:{"title":1, "_id":0}}})

        // newUsersFollowing = user.usersFollowing.map((usr)=> {return usr.username});
        // newFollowers = user.followers.map((usr)=> {return usr.username});
        // newPeopleFollowing = user.peopleFollowing.map((p)=> {return p.name});
        // user.usersFollowing = newUsersFollowing;
        // user.peopleFollowing = newPeopleFollowing;
        // user.followers = newFollowers;

        const user = await model.getUser(req.params.username);
        

        if(user){
            res.status(200).json(user);
        }
    
        else{
            res.status(404).send();
        }
    }

    catch{
	    console.log(err);
    }

    finally{
        return;
    }



}

async function respondWithUsers(req, res){
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

        
        if(!req.query.username){
            req.query.username = "";
            results = await User.find({});
            newResults = results.map((obj)=>{return obj.username});
            results = newResults;
        }
    
        else{
            results = await User.find().byUsername(req.query.username);
            newResults = results.map((obj)=>{return obj.username});
            results = newResults;
            
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