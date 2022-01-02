
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



function addMovie(username, movieObj){
    return new Promise((mainResolve, mainReject)=>{
        userQuery = User.findOne().where("username").equals(username);
        movieQuery = Movie.findOne().where("title").equals(movieObj.title);
        newMovie = new Movie(movieObj);
        // console.log(movieObj);
        // console.log(newMovie);
        newMovie.actors = [];
        newMovie.writers = [];
    
        let userCheck = function(){
            return new Promise((resolve, reject)=>{
                console.log("User check called");
                userQuery.exec(function(err, result){
                    if(err){
                        reject(err);
                        return;
                    }
                    
                    console.log(result);
                    user = result;
            
                    if(!user){ 
                        // callback("This user does not exist");
                        // 
                        reject("This user does not exist");
                        return;
                    }
            
                    else{
                        if(!user.contributor){
                            console.log("Contributor?",user.contributor)
                            // callback("Only contributors can add movies")
                            reject("Only contributors can add movies");
                            return;
                        }

                        console.log("User check calling the next function")
                        resolve();
                        return;
                    }
    
                })
            })
        }
    
    
            let movieCheck = function(){
                return new Promise((resolve, reject)=>{
                    console.log("Movie check called")
                    Movie.findOne({title: movieObj.title}, function(err, result){
                        if(err){
                            reject(err);
                            return;
                        }
            
                        if(result){
                            reject("This movie already exists");
                            return;
                        }
    
                        else{
                            // console.log("Movie check calling the next function")
                            resolve();
                            return;
                            
                        }
                    })
                })
            }   
    
    
                let directorAddition = function(){
                    return new Promise((resolve, reject) =>{
                        console.log("director addition called")
                        Person.findOne({name:movieObj.director}, function(err, result){
                            if(err){
                                reject(err)
                                return;
                            }
        
                            else{
                                director = result;
                                //If the director already exists in the database, make them the movie director
                                if(director){
                                    newMovie.director = director.name;
                                    // console.log("director check calling the next function")
                                    resolve();
                                    return;
                                }
        
                                //Otherwise add them to the database then make them the movie director
                                else{
                                    directorName = movieObj.director;
                                    Person.create({name:directorName, director:true}, function(err, newInstance){
                                        if(err){
                                            reject(err);
                                            return;
                                        }
                                        newMovie.director = newInstance.name;
                                        // console.log("director check calling the next function")
                                        resolve();
                                        return;
                                    })
                                }
        
        
                                }
                        })
                    })
    
                }
    
                let actorAddition = function(){
                    return new Promise((resolve, reject)=>{
                        console.log("Actor addition called")
                        actorsAdded = 0;
                        movieObj.actors.forEach(actorName =>{
                            Person.findOne({name:actorName}, function(err, result){
                                if(err){
                                    reject(err)
                                    return;
                                }
        
                                else{
                                    actor = result;
                                    // If the actor exists in the database
                                    if(actor){
                                        newMovie.actors.push(actor["_id"])
                                        console.log("Actors:", newMovie.actors)
                                        ++actorsAdded;
                                      
                                    }
            
                                    //If the actor is not in the database, add them
                                    else{
                                        Person.create({name:actorName, actor:true}, function(err, result){
                                            if(err){
                                                reject(err);
                                                return;
                                            }
                                            actor = result;
                                            newMovie.actors.push(actor["_id"])
                                            ++actorsAdded;
                                            
                                           
                                            if(actorsAdded >= movieObj.actors.length){
                                                // console.log("Actor check calling the next function")
                                                resolve();
                                                return;
                                            }
                                        })
                                    }
        
                                }
        
        
        
        
        
                            })
                        })
                    })
    
    
                }
    
                let writerAddition = function(){
                    return new Promise((resolve, reject)=>{
                        console.log("Writer addition called")
                        writersAdded = 0;
                        movieObj.writers.forEach(writerName =>{
                            Person.findOne({name:writerName}, function(err, result){
                                if(err){
                                    reject(err)
                                    return;
                                }
        
                                else{
                                    writer = result;
                                    // If the writer exists in the database
                                    if(writer){
                                        newMovie.writers.push(writer["_id"])
                                        console.log(newMovie.writers)
                                        ++writersAdded;
                                        // resolve();
                                    }
            
                                    //If the writer is not in the database, add them
                                    else{
                                        Person.create({name:writerName, writer:true}, function(err, result){
                                            if(err){
                                                reject(err);
                                                return;
                                            }
        
                                            else{
                                                writer = result;
                                                newMovie.writers.push(writer["_id"])
                                                ++writersAdded;
                                                
                                            }
                 
                                           console.log("Added writers:", writersAdded, "Writers:", movieObj.writers.length);
                                            if(writersAdded >= movieObj.writers.length){
                                                // console.log("Writer additon calling the next function")
                                                resolve();
                                                return;
                                            }
                                        })
                                    }
        
                                }
        
        
        
        
        
                            })
                        })
                    })
        
    
                }
    
                let saveMovie = function(){
                    return new Promise((resolve, reject)=>{
                        console.log(newMovie);
                        Movie.create(newMovie, function(err, result){
                            if(err){    
                                reject(err);
                            }
                            console.log(result);
                            mainResolve();
                        });
                    })
                }


                errorOccured = false;
                userCheck().then(movieCheck()).then(directorAddition()).then(actorAddition()).then(writerAddition()).then(saveMovie()).catch((err)=>{
                    console.log(err);
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
function changeAccountType(username){
    return new Promise((resolve, reject)=>{
        userQuery = User.findOne().where("username").equals(username)
        userQuery.exec(function(err, result){
            if(err){
                
                reject(err);
                return;
            }
    
            user = result;
            if(!user){
                reject("This user does not exist");
                return; 
            }

            else{
                user.contributor = !user.contributor;
                user.save(function(err){
                    if(err){   
                        reject(err);
                        return;
                    }
        
                    resolve();
                    return;
        
                })
            }
               

        })
    })
 
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