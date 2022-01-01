
const mongoose = require("mongoose");
const model = require("./businessLogic");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notificaiton = require("./NotificationModel");
mongoose.connect('mongodb://localhost:27017/movieDB', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('connected', function() {
    console.log('database is connected successfully');
});
db.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
db.on('error', console.error.bind(console, 'connection error:'));


/*
This function initializes user attributes of a new user object and 
adds the user to the users object if it is valid

Input: userObj: User object containing only username and password attributes

Output: boolean representing whether the user was successfully added or not

A user is added sucessfully if:
The username of the user is not taken
The user object is valid (has a username and password attribute)
*/
function addUser(userObj, callback){
    // newUser = new User(userObj);
    User.create(userObj, function(err, result){
        if(err){
			console.log(err);
			callback("Could not create user", false);
		}
       
        callback();
    })

}

/*
This function adds a user to the database provided the user adding them is valid
and enough information about the person has been provided

Input: userObj: user object
       personObj: person object
Output: boolean representing whether the person was successfully added or not


*/
function addPerson(username, personObj, callback){
    userQuery = User.findOne().where("username").equals(username);
    userQuery.exec(function(err, result){
        if(err){
            console.log(err);
            callback("Could not insert person");
            return;
        }
        user = result;
        if(user){
            if (user.contributor){
                person = new Person(personObj);
                Person.create(personObj,function(err){
                    if(err){
                        // callback("Could not insert person");
                        console.log(err);
                        return;
                    }
                    callback();
                });
            }

            else{
                callback("The user specified is not a contributor");
                return;
            }
        }

        else{
            callback("This user does not exist");
            return;
        }
    });
    
}



function addMovie(username, movieObj, callback){
    userQuery = User.findOne().where("username").equals(username);
    movieQuery = Movie.findOne().where("title").equals(movieObj.title);
    newMovie = new Movie(movieObj);
    console.log(newMovie);
    newMovie.actors = [];
    newMovie.writers = [];

    userQuery.exec(function(err, result){
        if(err){
            callback("Could not add movie 1");
            console.log(err);
            return;
        }

        user = result;

        if(!user){ 
            callback("This user does not exist");
            console.log(err);
            return;
        }

        if(!user.contributor){
            callback("Only contributors can add movies")
            return;
        }

        Movie.findOne({title: movieObj.title}, function(err, result){
            if(err){
                console.log(err);
                callback("Could not add movie 3");
                console.log(err);
                return;
            }

            if(result){
                callback("A movie with this title already exists");
                return;
            }

            let directorAddition = function(callback){
                Person.findOne({name:movieObj.director}, function(err, result){
                    if(err){
                        console.log(err);
                    }

                    else{
                        director = result;
                        //If the director already exists in the database, make them the movie director
                        if(director){
                            newMovie.director = director.name;
                            callback();
                        }

                        //Otherwise add them to the database then make them the movie director
                        else{
                            directorName = movieObj.director;
                            Person.create({name:directorName, director:true}, function(err, newInstance){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                newMovie.director = newInstance.name;
                                callback();
                            })
                        }


                        }
                })
            }

            let actorAddition = function(callback){
                console.log("Actor addition called")
                actorsAdded = 0;
                movieObj.actors.forEach(actorName =>{
                    Person.findOne({name:actorName}, function(err, result){
                        if(err){
                            console.log(err);
                        }

                        else{
                            actor = result;
                            // If the actor exists in the database
                            if(actor){
                                newMovie.actors.push(actor["_id"])
                                ++actorsAdded;
                                callback();
                            }
    
                            //If the actor is not in the database, add them
                            else{
                                Person.create({name:actorName, actor:true}, function(err, result){
                                    if(err){
                                        console.log(err);
                                        return;
                                    }
                                    actor = result;
                                    newMovie.actors.push(actor["_id"])
                                    ++actorsAdded;
                                   
                                    if(actorsAdded >= movieObj.actors.length){
                                        callback();
                                    }
                                })
                            }

                        }





                    })
                })

            }

            let writerAddition = function(callback){
                console.log("Writer addition called")
                // writersAdded = 0;
                // movieObj.writers.forEach(writerName =>{
                //     Person.findOne({name:writerName}, function(err, result){
                //         if(err){
                //             console.log(err);
                //         }

                //         else{
                //             writer = result;
                //             // If the writer exists in the database
                //             if(writer){
                //                 newMovie.writers.push(writer["_id"])
                //                 ++writersAdded;
                //                 callback();
                //             }
    
                //             //If the writer is not in the database, add them
                //             else{
                //                 Person.create({name:writerName, writer:true}, function(err, result){
                //                     if(err){
                //                         console.log(err);
                //                         return;
                //                     }

                //                     else{
                //                         writer = result;
                //                         newMovie.writers.push(writer["_id"])
                //                         ++writersAdded;
                //                     }
         
                                   
                //                     if(writersAdded >= movieObj.writers.length){
                //                         callback();
                //                     }
                //                 })
                //             }

                //         }





                //     })
                // })

            }

            directorAddition(
                function(){
                    actorAddition(
                        function(){
                            writerAddition(
                                function(){
                                    // Movie.create(newMovie, function(err, result){
                                    //     if(err){
                                    //         console.log(err);
                                    //         return;
                                    //     }
                                    //     console.log(result);
                                    // });
                                    console.log("DONE");
                                }
                            )
                        }
                    )
                    }
            )
            

            // directorAddition(actorAddition(writerAddition(function(){
            //     // console.log(newMovie);
                // Movie.create(newMovie, function(err, result){
                //     if(err){
                //         console.log(err);
                //         return;
                //     }
                //     console.log(result);
                // });
                // newMovie.save(function(err){
                //     if(err){
                //         // callback("Could not add movie 12");
                //         console.log(err);
                //         return;
                //     }
                //     console.log("Inserted movie!")
                //     updateCollaborators(newMovie);
                //     updateSimilarMovies();

                // // })
            // })))



    })
})
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

Input: user1: the username of user that is following another user object
       user2 :the username of user that is being followed by another user object
Output: Boolean representing whether the lists were properly updated


*/
function followUser(userOneName, userTwoName, callback){
    userOneQuery = User.findOne().where("username").equals(userOneName);
    userTwoQuery = User.findOne().where("username").equals(userTwoName);
    userOneQuery.exec(function(err, result){
        if(err){
            console.log(err);
            return false;
        }

        userOne = result;

        if(!userOne){ return false;}
        
        userTwoQuery.exec(function(err, result){
            if(err){
                console.log(err);
                callback("Could not follow user")
                return;
            }
        
    
            userTwo = result;
            if(!userTwo){ 
                callback("Could not follow user");
                return;
            }
            
            //Add userTwo to userOne's list of users they are following if they aren't there already
            index = userOne.usersFollowing.indexOf(userTwo["_id"]);
            if(index == -1){
                userOne.usersFollowing.push(userTwo["_id"])
            }

            else{ 
                callback("Could not follow user");
                return;
            }

            index = userTwo.followers.indexOf(userOne["_id"]);
            if(index == -1){
                userTwo.followers.push(userOne["_id"]);
            }
            else{ 
                callback("Could not follow user");
                return; 
            }

            //Saving changes 
            userOne.save(function(err){
                if(err){
                    console.log(err);
                    callback("Could not follow user");
                    return;
                }
    
            })
            userTwo.save(function(err){
                if(err){
                    console.log(err);
                    callback("Could not follow user");
                    return;
                }

                callback();
                
    
            })
        
        });
    });
}

/*
This function removes userTwo from userOne's userFollowing list and
removes userOne from userTwo's followers list

Input: user1: the username of user that is unfollowing another user object
       user2 :the username of user that is being unfollowed by another user object
Output: Boolean representing whether the lists were updated


*/
function unfollowUser(userOneName, userTwoName, callback){
    userOneQuery = User.findOne().where("username").equals(userOneName);
    userTwoQuery = User.findOne().where("username").equals(userTwoName);

    userOneQuery.exec(function(err, result){
        if(err){
            console.log(err);
            callback("Could not unfollow user");
            return;
        }

        userOne = result;

        if(!userOne){
            callback("Could not unfollow user");
            return;
            }
        
        userTwoQuery.exec(function(err, result){
            if(err){
                console.log(err);
                callback("Could not unfollow user");
                return;
            }
        
   
        userTwo = result;
        if(!userTwo){
            callback("Could not unfollow user");
            return;
        }

        //Removing userTwo from userOne's list of users they are following
        index = userOne.usersFollowing.indexOf(userTwo["_id"]);
        if(index > -1){
            userOne.usersFollowing.splice(index, 1);
        }

        else{ 
            callback("Could not unfollow user");
            return;
        }

        //Removing userOne from userTwo's list of followers
        index = userTwo.followers.indexOf(userOne["_id"]);
        if(index > -1){
            userTwo.followers.splice(index, 1);
        }

        else{
            callback("Could not unfollow user");
            return;
        }
        })

        //Saving changes 
        userOne.save(function(err){
            if(err){
                console.log(err);
                callback("Could not unfollow user");
                return;
            }

        })
        userTwo.save(function(err){
            if(err){
                console.log(err);
                callback("Could not unfollow user");
                return;
            }

            callback();

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
            console.log(err);
            callback("Could not change account type");
            return;
        }

        user = result;
        if(!user){
            callback("This user does not exist");
            return; 
        }
           
        user.contributor = !user.contributor;
        user.save(function(err){
            if(err){
                console.log(err);
                callback("Could not change account type");
                return;
            }

            callback();

        })
    })
}






/*
This function adds a person to a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
function followPerson(username, personName, callback){
    userQuery = User.findOne().where("username").equals(username);
    personQuery = Person.findOne().where("name").equals(personName);
    userQuery.exec(function(err, result){
        if(err){
            console.log(err);
            callback("Could not follow person");
            return;
        }

        user = result;

        if(!user){ 
            callback("Could not follow person");
            return;
        }
        
        personQuery.exec(function(err, result){
            if(err){
                console.log(err);
                callback("Could not follow person");
                return;
            }
        
    
            person = result;
            if(!person){ 
                callback("Could not follow person");
                return;
            }
            
            //Add the person to the user's list of people they are following if they aren't there already
            index = user.peopleFollowing.indexOf(person["_id"]);
            if(index == -1){
                user.peopleFollowing.push(person["_id"])
            }

            else{ 
                callback("Could not follow person");
                return;
            }

            index = person.followers.indexOf(user["_id"]);
            if(index == -1){
                person.followers.push(user["_id"]);
            }
            else{
                callback("Could not follow person");
                return;
            }

            //Saving changes 
            user.save(function(err){
                if(err){
                    console.log(err);
                    callback("Could not follow person");
                    return;
                }
    
            })
            person.save(function(err){
                if(err){
                    console.log(err);
                    callback("Could not follow person");
                    return;
                }
                
                callback();
            })
        
        });
    });
}



/*
This function removes a person from a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
function unfollowPerson(username, personName, callback){
    personQuery = Person.findOne().where("name").equals(personName);
    userQuery = User.findOne().where("username").equals(username);
    userQuery.exec(function(err, result){
        if(err){
            console.log(err);
            callback("Could not unfollow person");
            return;
        }

        user = result;

        if(!user){ 
            callback("Could not unfollow person");
            return;
        }
        
        personQuery.exec(function(err, result){
            if(err){
                console.log(err);
                callback("Could not unfollow person");
                return;
            }
        
    
            person = result;
            if(!person){ 
                callback("Could not unfollow person");
                return;
            }
            //Remove the person from the user's list of people they are following
            index = user.peopleFollowing.indexOf(person["_id"]);
            if(index > -1){
                user.peopleFollowing.splice(index, 1);
            }

            else{ 
                callback("Could not unfollow person");
                return;
            }

            //Remove the user from the person's list of followers
            index = person.followers.indexOf(user["_id"]);
            if(index > -1){
                person.followers.splice(index, 1);
            }
            else{ 
                callback("Could not unfollow person");
                return;
            }

            //Saving changes 
            user.save(function(err){
                if(err){
                    console.log(err);
                    callback("Could not unfollow person");
                    return;
                }
    
            })
            person.save(function(err){
                if(err){
                    console.log(err);
                    callback("Could not unfollow person");
                    return;
                }
                callback();
    
            })
        
        });
    });
}


module.exports = {
    db,
    addUser,
    addPerson,
    addMovie,
    changeAccountType,
    followUser,
    unfollowUser,
    followPerson,
    unfollowPerson
}