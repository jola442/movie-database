const mongo = require
const mongoose = require("mongoose");
const model = require("./businessLogic");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notification = require("./NotificationModel");
// mongoose.connect('mongodb://localhost:27017/movieDB', {useNewUrlParser: true});
// const db = mongoose.connection;
// db.on('connected', function() {
//     console.log('database is connected successfully');
// });
// db.on('disconnected',function(){
//     console.log('database is disconnected successfully');
// })
// db.on('error', console.error.bind(console, 'connection error:'));


/*
This function initializes user attributes of a new user object and 
adds the user to the users object if it is valid

Input: userObj: User object containing only username and password attributes

Output: boolean representing whether the user was successfully added or not

A user is added sucessfully if:
The username of the user is not taken
The user object is valid (has a username and password attribute)
*/
function addUser(userObj){
    // newUser = new User(userObj);
    return new Promise((resolve, reject)=>{
        User.create(userObj, function(err){
            if(err){
                reject(err);
                return;
            }
           
            resolve();
            return;
        })
    })


}

/*
This function adds a user to the database provided the user adding them is valid
and enough information about the person has been provided

Input: userObj: user object
       personObj: person object
Output: boolean representing whether the person was successfully added or not


*/
function addPerson(username, personObj){
    return new Promise((resolve, reject)=>{
        userQuery = User.findOne().where("username").equals(username);
        userQuery.exec(function(err, result){
            if(err){
                reject(err);
                return;
            }
            user = result;
            if(user){
                if (user.contributor){
                    person = new Person(personObj);
                    Person.create(personObj,function(err){
                        if(err){
                            // callback("Could not insert person");
                            reject(err);
                        }
                        resolve();
                        return;
                    });
                }
    
                else{
                    reject();
                    return;
                }
            }
    
            else{
                reject();
                return;
            }
        });
    })

    
}



async function addMovie(username, movieObj){
        userQuery = User.findOne().where("username").equals(username);
        movieQuery = Movie.findOne().where("title").equals(movieObj.title);
        removeDuplicates(movieObj.actors)
        removeDuplicates(movieObj.writers);
        removeDuplicates(movieObj.genres);
        newMovie = new Movie(movieObj);
        newMovie.actors = [];
        newMovie.writers = [];

        try{
            await userCheck();
            await movieCheck();
            await directorAddition();
            await writerAdditon();
            // await actorAdditon();
            // await movieAddition();
        }

        catch(err){
            console.log(err);
        }

        finally{
            return;
        }

        async function userCheck(){
            // console.log("calling userCheck")
            userQuery.exec(function(err, result){
                if(err){
                    // console.log(err)
                    return (err);
                }
                
                // console.log(result);
                user = result;
        
                if(!user){ 
                    return(new Error("This user does not exist"));
                }
        
                else{
                    if(!user.contributor){
                        // console.log("Contributor?",user.contributor)
                        return(new Error("Only contributors can add movies"))
                    }

                    return;
    
                    // console.log("User check calling the next function")
                }
    
            })
        }

        async function movieCheck(){
            // console.log("Calling movie check")
            Movie.findOne({title: movieObj.title}, function(err, result){
                if(err){
                    return(err);
                }
    
                if(result){
                    return(new Error("This movie already exists"));
                }

                return;


                })
        }

        async function directorAddition(){
            // console.log("calling director addition")
            Person.findOne({name:movieObj.director}, function(err, result){
                if(err){
                    return(err);
                }
                console.log(arguments)
                
                    director = result;
                    //If the person with the specified user name exists
                    if(director){
                        //make them a director
                        Person.updateOne({name:director.name}, {director:true}, function(err){
                            if(err){
                                console.log(err);
                                return err;
                            }

                            newMovie.director = director.name;
                            return;
                        })
          
                    }
    
                    //Otherwise add them to the database then make them the movie director
                    else{
                        directorName = movieObj.director;
                        Person.create({name:directorName, director:true}, function(err, newInstance){
                            if(err){
                                return(err);
                            }
                            newMovie.director = newInstance.name;
                            return;
                                })
                            }
    
    
                    
                    
                })
        }

        async function addWriter(writerName){
            // console.log("Calling add writer")
            Person.findOne({name:writerName}, function(err, result){
                if(err){
                    console.log(err);
                    return err;
                }

                console.log(arguments)
                writer = result;
                // If the person with the name specified exists in the database

                if(writer){
                    // console.log(writer.name, "is already in the db!")
                    //make them a writer
                    Person.updateOne({name:writer.name}, {writer:true}, function(err){
                        if(err){
                            return (err);
                        }

                        newMovie.writers.push(writer["_id"]);
                        // console.log("Writers: ", newMovie.writers)
                        return;
                    })
        
                }

                //If the writer is not in the database, add them
                else{
                    // console.log("now creating", writerName, "and making them a writer")
                    Person.create({name:writerName, writer:true}, function(err, result){
                        if(err){
                            console.log(err);
                            return err;
                        }

                        else{
                            writer = result;
                            newMovie.writers.push(writer["_id"])
                            // console.log("Writers: ", newMovie.writers)
                            return;
                            
                        }

                    })
                }
        
            })
        }

        async function addActor(actorName){
            console.log("Trying to find a person whose name is")
            Person.findOne({name:actorName}, function(err, result){
                if(err){

                    console.log(err);
                    return err;
                }

                console.log(result);

                
                
                    actor = result;
                    // console.log(actor)
                    // If a person with this name exists in the database
                    if(actor){
                        // console.log(actor.name, "is already in the db!")
                        //make them an actor
                        Person.updateOne({name:actor.name}, {actor:true}, function(err){
                            if(err){
                           
                                console.log(err);
                                return err;
                            }

                            newMovie.actors.push(actor["_id"]);
                            // console.log("Actors: ", newMovie.actors)
                            return;
                        })
          
                    }

                    //If the actor is not in the database, add them
                    else{
                        // console.log("now creating", actorName, "and making them an actor")
                        Person.create({name:actorName, actor:true}, function(err, result){
                            if(err){
                                console.log("From actor addition")
                                console.log(err);
                                return err;
                            }

                            else{
                                actor = result;
                                newMovie.actors.push(actor["_id"])
                                // console.log("Actors: ", newMovie.actors)
                                return;
                                
                            }

                })
            }
        
    })
        }

        async function writerAdditon(){
            for(i = 0; i < movieObj.writers.length; ++i){
                try{
                    await addWriter(movieObj.writers[i]);
                }

                catch(err){
                    // console.log(err);
                }
            }

            return;
        }

        async function actorAdditon(){
            for(i = 0; i < movieObj.actors.length; ++i){
                try{
                    await addActor(movieObj.actors[i]);
                }

                catch(err){
                    // console.log(err);
                }
            }
            return;
        }

        async function movieAddition(){
            Movie.create(newMovie, function(err, result){
                if(err){
                    console.log(err);
                    return err;
                }

                console.log("New movie after insertion: \n", result);

            })
        }
       
}
            
                                                    
function updateCollaborators(movieModel){
    return;
}

function updateSimilarMovies(movieModel){
    return;
}

 /*
This function adds userTwo to userOne's userFollowing list and
adds userOne to userTwo's followers list
;
Input: user1: the username of user that is following another user object
       user2 :the username of user that is being followed by another user object
Output: Boolean representing whether the lists were properly updated


*/
function followUser(userOneName, userTwoName){
    return new Promise((resolve, reject)=>{
        userOneQuery = User.findOne().where("username").equals(userOneName);
        userTwoQuery = User.findOne().where("username").equals(userTwoName);
        userOneQuery.exec(function(err, result){
            if(err){
                reject(err);
                return;
            }

            userOne = result;

            if(!userOne){ reject();}
            
            userTwoQuery.exec(function(err, result){
                if(err){
                    reject(err);
                    return;
                }
            
        
                userTwo = result;
                if(!userTwo){ 
                    reject();
                    return;
                }
                
                //Add userTwo to userOne's list of users they are following if they aren't there already
                index = userOne.usersFollowing.indexOf(userTwo["_id"]);
                if(index == -1){
                    userOne.usersFollowing.push(userTwo["_id"])
                }

                else{ 
                    reject();
                    return;
                }

                index = userTwo.followers.indexOf(userOne["_id"]);
                if(index == -1){
                    userTwo.followers.push(userOne["_id"]);
                }
                else{ 
                    reject();
                    return;
                }

                //Saving changes 
                userOne.save(function(err){
                    if(err){
                        reject(err);
                        return;
                    }
        
                })
                userTwo.save(function(err){
                    if(err){
                        reject(err);
                        return
                    }

                    resolve();
                    return;
                    
        
                })
            
            });
        });
    })
    
}

/*
This function removes userTwo from userOne's userFollowing list and
removes userOne from userTwo's followers list

Input: user1: the username of user that is unfollowing another user object
       user2 :the username of user that is being unfollowed by another user object
Output: Boolean representing whether the lists were updated


*/
function unfollowUser(userOneName, userTwoName){
    return new Promise((resolve, reject)=>{
        userOneQuery = User.findOne().where("username").equals(userOneName);
        userTwoQuery = User.findOne().where("username").equals(userTwoName);
    
        userOneQuery.exec(function(err, result){
            if(err){
                
                reject(err);
                return;
            }
    
            userOne = result;
    
            if(!userOne){
                reject();
                return;
                }
            
            userTwoQuery.exec(function(err, result){
                if(err){
                    
                    reject();
                    return;
                }
            
       
            userTwo = result;
            if(!userTwo){
                reject();
                return;
            }
    
            //Removing userTwo from userOne's list of users they are following
            index = userOne.usersFollowing.indexOf(userTwo["_id"]);
            if(index > -1){
                userOne.usersFollowing.splice(index, 1);
            }
    
            else{ 
                reject();
                return;
            }
    
            //Removing userOne from userTwo's list of followers
            index = userTwo.followers.indexOf(userOne["_id"]);
            if(index > -1){
                userTwo.followers.splice(index, 1);
            }
    
            else{
                reject();
                return;
            }
            })
    
            //Saving changes 
            userOne.save(function(err){
                if(err){
                    
                    reject();
                    return;
                }
    
            })
            userTwo.save(function(err){
                if(err){
                    
                    reject();
                    return;
                }
    
                resolve();
                return;
    
            })
    
        })
    })
   
}

/*
This procedure

Input: username: username of the user
Output: none;

Assumption
The user will not have the option of changing account types if it
is not their page
*/
function changeAccountType(username, callback){
   
    userQuery = User.findOne().where("username").equals(username)
    userQuery.exec(function(err, result){
        if(err){
            // console.log(err);
            callback("Could not change account type");
            return;
        }

        user = result;
        if(!user){
            callback("This user does not exist");
            return; 
        }

        user.contributor = !user.contributor;

        User.updateOne({username:username}, {contributor:user.contributor}, function(err){
            if(err){
                // console.log(err);
                callback(err)
            }

            callback()

        })
    })
    //     user.save(function(err){
    //         if(err){
    //             console.log(err);
    //             callback("Could not change account type");
    //         }

    //         else{
    //             user.contributor = !user.contributor;
    //             user.save(function(err){
    //                 if(err){   
    //                     console.log(err);
    //                     return;
    //                 }

    //                 callback();
    //                 return;

    //             })
    //         }
    //     })
    // })
}






/*
This function adds a person to a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
function followPerson(username, personName){
    return new Promise((resolve, reject)=>{
        userQuery = User.findOne().where("username").equals(username);
        personQuery = Person.findOne().where("name").equals(personName);
        userQuery.exec(function(err, result){
            if(err){
                
                reject(err);
                return;
            }
    
            user = result;
    
            if(!user){ 
                reject();
                return;
            }
            
            personQuery.exec(function(err, result){
                if(err){
                    
                    reject(err);
                    return;
                }
            
        
                person = result;
                if(!person){ 
                    reject();
                    return;
                }
                
                //Add the person to the user's list of people they are following if they aren't there already
                index = user.peopleFollowing.indexOf(person["_id"]);
                if(index == -1){
                    user.peopleFollowing.push(person["_id"])
                }
    
                else{ 
                    reject();
                    return;
                }
    
                index = person.followers.indexOf(user["_id"]);
                if(index == -1){
                    person.followers.push(user["_id"]);
                }
                else{
                    reject();
                    return;
                }
    
                //Saving changes 
                user.save(function(err){
                    if(err){
                        
                        reject(err);
                        return;
                    }
        
                })
                person.save(function(err){
                    if(err){
                        
                        reject(err);
                        return;
                    }
                    
                    resolve();
                    return;
                })
            
            });
        });
    })

}



/*
This function removes a person from a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
function unfollowPerson(username, personName){
    return new Promise((resolve, reject)=>{
        personQuery = Person.findOne().where("name").equals(personName);
        userQuery = User.findOne().where("username").equals(username);
        userQuery.exec(function(err, result){
            if(err){
                
                reject(err);
                return;
            }
    
            user = result;
    
            if(!user){ 
                reject();
                return;
            }
            
            personQuery.exec(function(err, result){
                if(err){
                    
                    reject(err);
                    return;
                }
            
        
                person = result;
                if(!person){ 
                    reject();
                    return;
                }
                //Remove the person from the user's list of people they are following
                index = user.peopleFollowing.indexOf(person["_id"]);
                if(index > -1){
                    user.peopleFollowing.splice(index, 1);
                }
    
                else{ 
                    reject();
                    return;
                }
    
                //Remove the user from the person's list of followers
                index = person.followers.indexOf(user["_id"]);
                if(index > -1){
                    person.followers.splice(index, 1);
                }
                else{ 
                    reject();
                    return;
                }
    
                //Saving changes 
                user.save(function(err){
                    if(err){
                        
                        reject(err);
                        return;
                    }
        
                })
                person.save(function(err){
                    if(err){
                        
                        reject(err);
                        return;
                    }
                    resolve();
                    return;
        
                })
            
            });
        });
    })

}

function removeDuplicates(lst){
    lst = new Set(lst);
    lst = Array.from(lst);
    return lst;
}

module.exports = {
    addUser,
    addPerson,
    addMovie,
    changeAccountType,
    followUser,
    unfollowUser,
    followPerson,
    unfollowPerson
}