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
            req.session.user = newUser;
            req.session.username = newUser.username;
            res.status(200).send();
        }

    }   

    catch{
        console.log(err);
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
            res.status(200).send();
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
            success = await model.unfollowUser(req.session.username, req.params.username)
            if(success){
                res.status(200).send();
            }
    
            else{
                res.status(304).send();
            }
        }
    
        else if(req.body.follow == true){
            success = model.followUser(req.session.username, req.params.username);
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
            res.format({"text/html": function(){
                console.log(user);
                res.status(200).render("pages/user", {username:req.session.username, user:user, reviews:user.reviews})
            },
            "application/json": function(){
                res.status(200).json(user);
            }});
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
    console.log(req.query);
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
            results = await User.find({}).limit(ENTRIES_PER_PAGE).skip((req.query.page-1)*ENTRIES_PER_PAGE);
            newResults = results.map((obj)=>{return obj.username});
            results = newResults;
        }
    
        else{
            results = await User.find().byUsername(req.query.username).limit(ENTRIES_PER_PAGE).skip((req.query.page-1)*ENTRIES_PER_PAGE).lean().select({"username":1, "_id":0});
            newResults = results.map((obj)=>{return obj.username});
            results = newResults;
            
        }

        if(results.length > ENTRIES_PER_PAGE){
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
                res.status(200).render("pages/users", {qObj:queryObject, username: req.session.username, users:results});
            }, 
            "application/json":function(req, res, next){
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