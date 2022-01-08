const mongo = require
const mongoose = require("mongoose");
const model = require("./businessLogic");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notification = require("./NotificationModel");
var ObjectId = require('mongodb').ObjectId;


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
async function addUser(userObj){
    // newUser = new User(userObj);
    newUser = new User(userObj);
    await newUser.save();
    return;
}

/*
This function adds a user to the database provided the user adding them is valid
and enough information about the person has been provided

Input: userObj: user object
       personObj: person object
Output: boolean representing whether the person was successfully added or not


*/
async function addPerson(username, personObj){
    const user = await User.findOne({ username });
    if(user){
        if(user.contributor){
            person = await Person.create(personObj);
            return true;
        }
        else{
            console.log("Error. This user is not a contributor");
            return false;
        }
    }

    else{
        console.log("Error. This user does not exist");
        return false;
    }

}

async function addReview(username, reviewObj){
    const user = await User.findOne({ username });
    // console.log(reviewObj);
    if(user){
        const movie = await Movie.findOne({title: reviewObj.title});
        if(movie){
            reviewObj.reviewer = user["_id"];
            reviewObj.movie = movie["_id"];
            const newReview = await Review.create(reviewObj);

            if(newReview){
                user.reviews.push(newReview["_id"])
                await user.save();
                return true;
            }
           
            else{
                console.log("Error.Unable to add review")
                return false;
            } 

        }

        else{
            console.log("Error. This movie does not exist");
            return false;
        }
    }

    else{
        console.log("Error. This user does not exist");
        return false;
    }
}



async function addMovie(username, movieObj){
        // console.log(movieObj);
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
            await actorAdditon();
            await movieAddition();
        }

        catch(err){
            console.log(err);
        }

        finally{
            return;
        }

        async function userCheck(){
            // console.log("calling userCheck")

            user = await User.findOne({ username })
            if(user){
                if(!user.contributor){
                    console.log(username, "is not a contributor. Only contributors can add movies");
                }
                return;

            }

            else{
                console.log("The user", username, "does not exist");
            }
        }

        async function movieCheck(){
            // console.log("Calling movie check")
            movie = await Movie.findOne({title: movieObj.title})
            if(movie){
                console.log("The movie", movieObj.title, "already exists");
            }

            return;
        }

        async function directorAddition(){
            // console.log("calling director addition")
            director = await Person.findOne({name:movieObj.director})
            if(director){
                director.director = true;
                await director.save();
                newMovie.director = director["_id"];
                return;
            }

            else{
                directorName = movieObj.director;
                const director = await Person.create({name:directorName, director:true});
                newMovie.director = director["_id"];
                return;
            }       
               
        }

        async function addWriter(writerName){
            // console.log("Calling add writer")
            writer = await Person.findOne({name:writerName});
            if(writer){
                writer.writer = true;
                await writer.save();
                newMovie.writers.push(writer["_id"]);
            }

            else{
                writer = await Person.create({name:writerName, writer:true});
                if(writer){
                    newMovie.writers.push(writer["_id"]);
                }
                return;
            }

        
   
        
      
        }

        async function addActor(actorName){
            actor = await Person.findOne({name:actorName});
            if(actor){
                actor.actor = true;
                await actor.save();
                newMovie.actors.push(actor["_id"]);
            }

            else{
                actor = await Person.create({name:actorName, actor:true});
                if(actor){
                    newMovie.actors.push(actor["_id"]);
                }
                return;
            }
    }

        async function writerAdditon(){
            for(i = 0; i < movieObj.writers.length; ++i){
                try{
                    await addWriter(movieObj.writers[i]);
                }

                catch(err){
                    console.log(err);
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
                    console.log(err);
                }
            }
            return;
        }

        async function movieAddition(){
            const movie = await Movie.create(newMovie);
            personnel = movie.actors.concat(movie.writers, [movie.director]);
            // console.log(personnel);
            if(movie){
                // console.log(movie['averageRating']);
                
                // console.log(movie);
                for(let i = 0; i < personnel.length; ++i){
                    const personOne = await Person.findById(personnel[i]);
                    // console.log(i);
                    // console.log(personOne);

                    if(personOne){
                        personOne.movies.push(movie["_id"]);
                        await personOne.save();
                    }
                }
                return;
            }

            else{
                return;
            }
        }
                        
                        // for(let j = 0; j < personnel.length; ++j){
                        //     personTwo = await Person.findById(personnel[j]);

                        //     if(personTwo){
                        //         if(personOne.name === personTwo.name) continue;
                        //         if(!personOne.collaborators){
                        //             personOne.collaborators[personTwo.name]= 1;
                        //         }

                        //         else if(personOne.collaborators.hasOwnProperty(personTwo.name)){
                        //             numTimesWorkedWith = personOne.collaborators.get(personTwo.name);
                        //             personOne.collaborators.set(personTwo.name, numTimesWorkedWith+1);
                        //         }
                        //         else{
                        //             personOne.collaborators[personTwo.name] = 1;
                        //         }
                        //         await personTwo.save();
                        //     }
                    
                        // }
                


        

                // //Updating the collaborators of every person involved in the movie
                // for(let i = 0; i < movieObj.personnel.length; i++){
                //     let personOneName = movieObj.personnel[i];
                //     for(let j = 0; j < movieObj.personnel.length; j++){
                //         let personTwoName = movieObj.personnel[j];
                //         if(personOneName === personTwoName){
                //             continue;
                //         }
                //         if(people[personOneName].collaborators.hasOwnProperty(personTwoName)){
                //             people[personOneName].collaborators[personTwoName]++;
                //         }
                //         else{
                //             people[personOneName].collaborators[personTwoName] = 1;
                //         }
                            
                //     }
                // }

        async function updateCollaborators(movieModel){
            return;
        }

    }
       

            
                                                    


function updateSimilarMovies(movieModel){
    return;
}


// function updateSimilarMovies(){
//     let movieKeys = Object.keys(movies);
//     for(let i = 0; i < movieKeys.length; i++){
//         let movieOne = movies[movieKeys[i]];
//         for(let j = 0; j < movieKeys.length; j++){
//             if(movieKeys[i] === movieKeys[j]){
//                 continue;
//             }

//             let movieTwo = movies[movieKeys[j]];

//             if(calculateJaccardIndex(movieOne.genres, movieTwo.genres) > 50 && movieOne.rated === movieTwo.rated){
//                 movies[movieOne.title].similarMovies.push(movieTwo.title);
//                 movies[movieTwo.title].similarMovies.push(movieOne.title);

//             }
//             movies[movieTwo.title].similarMovies = removeDuplicates(movies[movieTwo.title].similarMovies);
//         }
//         movies[movieOne.title].similarMovies = removeDuplicates(movies[movieOne.title].similarMovies);
//     }
// }


 /*
This function adds userTwo to userOne's userFollowing list and
adds userOne to userTwo's followers list
;
Input: user1: the username of user that is following another user object
       user2 :the username of user that is being followed by another user object
Output: Boolean representing whether the lists were properly updated


*/
async function followUser(userOneName, userTwoName){
    const userOne = await User.findOne({username: userOneName});
    const userTwo = await User.findOne({username: userTwoName});

    if(userOne){
        if(userTwo){
            index = userOne.usersFollowing.indexOf(userTwo["_id"]);
            if(index == -1){
                userOne.usersFollowing.push(userTwo["_id"])
            }

            else{
                console.log("Error. This user does not exist");
                return false;
            }

            index = userTwo.followers.indexOf(userOne["_id"]);
            if(index == -1){
                userTwo.followers.push(userOne["_id"]);
            }
            else{ 
                console.log("Error. This user does not exist");
                return false;
            }

            await userOne.save();
            await userTwo.save();
            return true;
        }

        else{
            console.log("Error. This user does not exist");
            return false;
        }

    }
    
}

/*
This function removes userTwo from userOne's userFollowing list and
removes userOne from userTwo's followers list

Input: user1: the username of user that is unfollowing another user object
       user2 :the username of user that is being unfollowed by another user object
Output: Boolean representing whether the lists were updated


*/
async function unfollowUser(userOneName, userTwoName){
    const userOne = await User.findOne({username: userOneName});
    const userTwo = await User.findOne({username: userTwoName});

    if(userOne){
        if(userTwo){
            //Removing userTwo from userOne's list of users they are following
            index = userOne.usersFollowing.indexOf(userTwo["_id"]);
            if(index > -1){
                userOne.usersFollowing.splice(index, 1);
            }
    
            else{ 
                console.log("Error. This user does not exist");
                return false;
            }
    
            //Removing userOne from userTwo's list of followers
            index = userTwo.followers.indexOf(userOne["_id"]);
            if(index > -1){
                userTwo.followers.splice(index, 1);
            }
    
            else{
                console.log("Error. This user does not exist");
                return false;
            }

            await userOne.save();
            await userTwo.save();
            return true;
        }
    }
    
}
   

/*
This procedure

Input: username: username of the user
Output: none;

Assumption
The user will not have the option of changing account types if it
is not their page
*/
async function changeAccountType(username){
    user = await User.findOne({ username });
    if(user){
        user.contributor = !user.contributor;
        await user.save();
        return true;
    }

    else{
        return false;
    }
 
}
 

/*
This function adds a person to a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
async function followPerson(username, personName){
    const user = await User.findOne({ username });
    const person = await Person.findOne({ personName});

    if(user){
        if(person){
            //Add the person to the user's list of people they are following if they aren't there already
            index = user.peopleFollowing.indexOf(person["_id"]);
            if(index == -1){
                user.peopleFollowing.push(person["_id"])
            }

            else{ 
                console.log("You already follow this person");
                return false;
            }

            index = person.followers.indexOf(user["_id"]);
            if(index == -1){
                person.followers.push(user["_id"]);
            }
            else{ 
                console.log("You already follow this person");
                return false;
            }

            await user.save();
            await person.save();
        }

        else{
            console.log("Error. This person does not exist");
            return false;
        }
    }

    else{
        console.log("Error. This user does not exist");
        return false;
    }
       
}



/*
This function removes a person from a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
async function unfollowPerson(username, personName){
    const user = await User.findOne({ username });
    const person = await Person.findOne({ personName});

    if(user){
        if(person){
            //Remove the person from the user's list of people they are following
            index = user.peopleFollowing.indexOf(person["_id"]);
            if(index > -1){
                user.peopleFollowing.splice(index, 1);
            }

            else{ 
                console.log("Error unfollowing person");
                return false;
            }

            //Remove the user from the person's list of followers
            index = person.followers.indexOf(user["_id"]);
            if(index > -1){
                person.followers.splice(index, 1);
            }
            else{ 
                console.log("Error unfollowing person");
                return false;
            }

            await user.save();
            await person.save();
            return true;
        }
        else{ 
            console.log("This person does not exist");
            return false;
        }
    }
    else{ 
        console.log("This user does not exist");
        return false;
    }
}

async function getAverageRating(title){
    movie = await Movie.findOne({  title });
    if(movie){
        const rating = await Review.aggregate([
            {$match:  {movie: movie["_id"]}},
            {$group: {_id: "$movie", average: {$avg : "$rating"}}}
        ]);

        return rating[0].average;
    }
    else{
        return;
    }
}

async function getReviews(title){
    movie = await Movie.findOne({  title });
    if(movie){
        const reviews = await Review.find({movie: movie["_id"]}).populate({path:'reviewer', select:{'username':1, "_id":0}}).select('rating basic reviewText summary').exec();
        return reviews;
    }
    else{
        return [];
    }
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
    addReview,
    changeAccountType,
    followUser,
    unfollowUser,
    followPerson,
    unfollowPerson,
    getAverageRating,
    getReviews
}