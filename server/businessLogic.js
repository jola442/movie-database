const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");

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
// async function addPerson(username, personObj){
//     const user = await User.findOne({ username });
//     if(user){
//         if(user.contributor){
//             person = await Person.create(personObj);
//             return true;
//         }
//         else{
//             console.log("Error. This user is not a contributor");
//             return false;
//         }
//     }

//     else{
//         console.log("Error. This user does not exist");
//         return false;
//     }

// }

async function addPerson(personObj){
    try{
        let person = await Person.create(personObj);
        return true;
    }

    catch(err){
        console.log(err)
        return false;
    }
}

async function addActor(actorObj){
    try{
        let person = await Person.findOne({name:actorObj.name});
      
        if(!person){
            let addedPerson = await addPerson({name:actorObj.name});
            if(!addedPerson){
                return false;
            }

            person = await Person.findOne({name:actorObj.name});
        }
            let movie = await Movie.findOne({title:actorObj.movie});
            console.log("found this movie", movie);
  
    
            if(movie){
                if(movie.actors.includes(person.id) || person.movies.includes(movie.id)){
                    return false;
                }
                movie.actors.push(person.id);
                person.movies.push(movie.id);
                person.actor = true;
                await movie.save();
                await person.save();
                return true;
            }

            else{
                return false;
            }
    
        }

    catch(err){
        console.log(err);
        return false;
    }

}

async function addWriter(writerObj){
    try{
        let person = await Person.findOne({name:writerObj.name});
        
        if(!person){
            let addedPerson = await addPerson({name:writerObj.name});
            if(!addedPerson){
                return false;
            }

            person = await Person.findOne({name:writerObj.name});
        }
            let movie = await Movie.findOne({title:writerObj.movie});
            console.log("found this movie", movie);
  
    
            if(movie){
                if(movie.writers.includes(person.id) || person.movies.includes(movie.id)){
                    return false;
                }
                movie.writers.push(person.id);
                person.movies.push(movie.id);
                person.writer = true;
                await movie.save();
                await person.save();
                return true;
            }

            else{
                return false;
            }
    
        }

    catch(err){
        console.log(err);
        return false;
    }

}

async function changeDirector(directorObj){
    try{
        let person = await Person.findOne({name:directorObj.name});
      
        if(!person){
            let addedPerson = await addPerson({name:directorObj.name});
            if(!addedPerson){
                return false;
            }

            person = await Person.findOne({name:directorObj.name});
        }
            let movie = await Movie.findOne({title:directorObj.movie});
            console.log("found this movie", movie);
  
    
            if(movie){
                movie.director = person.id;
                person.movies.push(movie.id);
                person.director = true;
                await movie.save();
                await person.save();
                return true;
            }

            else{
                return false;
            }
    
        }

    catch(err){
        console.log(err);
        return false;
    }
}

async function addReview(username, reviewObj){
    const userObj = await User.findOne({ username });

    if(userObj){
        const movieObj = await Movie.findOne({title: reviewObj.movieTitle});

        if(movieObj){
            reviewObj.reviewer = userObj["_id"];
            reviewObj.movie = movieObj["_id"];
            reviewObj.rating = Number(reviewObj.rating);
            delete reviewObj.movieTitle;
            console.log("SERVER: Review Object: ",reviewObj)
            const newReview = await Review.create(reviewObj/*, function(err){
                if(err){
                    console.log(err);
                }
            }*/);

            
            console.log("SERVER: New Review:", newReview)

            if(newReview){
                movieObj.numRatings += 1;
                movieObj.totalRating += reviewObj.rating;
                //Rounding to one decimal place
                movieObj.averageRating = Math.round( (movieObj.totalRating/movieObj.numRatings) * 10)/10;
                userObj.reviews.push(newReview["_id"])
                console.log("SERVER: Movie Object:", movieObj)
                console.log("SERVER: User Object:", userObj)
                await userObj.save(function(err){
                    if(err){
                        console.log(err);
                    }
                });
  
                await movieObj.save(function(err){
                    if(err){
                        console.log(err);
                    }
                });
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

async function getMovie(title){
    const movie = await Movie.findOne({title});
    return movie;
}

//This function returns a javascript user object. It is not capable of using database functions
async function getUser(username){
    const user = await User.findOne({username}).lean()
    .populate('usersFollowing', 'username').populate('followers', 'username')
    .populate('peopleFollowing', 'name').populate({path: 'reviews', select:{"_id":0, "reviewer":0}, populate:{path:'movie', select:{"title":1, "_id":0}}})
    

    newUsersFollowing = user.usersFollowing.map((usr)=> {return usr.username});
    newFollowers = user.followers.map((usr)=> {return usr.username});
    newPeopleFollowing = user.peopleFollowing.map((p)=> {return p.name});
    user.usersFollowing = newUsersFollowing;
    user.peopleFollowing = newPeopleFollowing;
    user.followers = newFollowers;
    delete user.id;
    delete user.password;
    
    return user;
}

async function getPerson(name){
    const person = await Person.findOne({name});
    return person;
}

async function isContributor(username){
    const user = await getUser(username);
 
    if(user){
        return user.contributor;
    }

    else{
        return false;
    }
}


async function addMovie(username, movieObj){
        movieObj.actors = removeDuplicates(movieObj.actors)
        movieObj.writers = removeDuplicates(movieObj.writers);
        movieObj.genres = removeDuplicates(movieObj.genres);
        newMovie = new Movie(movieObj);
        newMovie.actors = [];
        newMovie.writers = [];
        
        try{
            returnVal = true;
            // userIsContributor = await isContributor(username);
            // if(userIsContributor){
                movie = await getMovie(movieObj.title); 
                if(!movie){
                    await directorAddition();
                    await writerAdditon();
                    await actorAdditon();
                    insertedMovie = await movieAddition();
                    if(!insertedMovie){
                        returnVal = false;
                    }
                }

                // else{
                //     returnVal = false;
                // }

            // }

            else{
                returnVal = false;
            }   
            
        }

        catch(err){
            console.log(err);
        }

        finally{
            return returnVal;
        }

        async function directorAddition(){
     
            director = await getPerson(movieObj.director);
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
            writer = await getPerson(writerName);
            if(writer){
                writer.writer = true;
  

                await writer.save();
                if(!newMovie.writers.includes(writer["_id"])){
                    newMovie.writers.push(writer["_id"]);
                }   
                
            }

            else{
                writer = await Person.create({name:writerName, writer:true});
                if(writer){
                    if(!newMovie.writers.includes(writer["_id"])){
                        newMovie.writers.push(writer["_id"]);
                    }   
                }
                return;
            }

        
   
        
      
        }

        async function addActor(actorName){
            actor = await getPerson(actorName);
            if(actor){
                actor.actor = true;
  
                await actor.save();
                if(!newMovie.actors.includes(actor["_id"])){
                    newMovie.actors.push(actor["_id"]);
                }              
            }

            else{
                actor = await Person.create({name:actorName, actor:true});
                if(actor){
                    if(!newMovie.actors.includes(actor["_id"])){
                        newMovie.actors.push(actor["_id"]);
                    }     
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
            // console.log("Personnel array from movieAddition:",personnel);
            if(movie){
                await updateSimilarMovies(movie);
                await updateCollaborators(personnel);
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
                return true;
            }

            return false;
        
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

        async function updateCollaborators(personnelArr){
            // let populatedPersonnelArr = await personnelArr.map( async (personID) => {
            //     let person = await Person.findOne({"_id": personID});
                // console.log("Finding the person with ID =" + personID + ": " + person);
            //     return person;
            // });

            populatedPersonnelArr = []

            for(let i = 0; i < personnelArr.length; i++){
                let personID = personnelArr[i];
                let person = await Person.findOne({"_id": personID});
                // console.log("Finding the person with ID =" + personID + ": " + person);
                populatedPersonnelArr.push(person);
            }


            //populating the personnel array
            // personnelArr.forEach( async (personID) => {
            //     let person = await Person.findOne({"_id": personID});
            //     console.log("Finding the person with ID =" + personID + ": " + person);
            //     populatedPersonnelArr.push(person);
            // })

            // console.log("Populated personnel array:",populatedPersonnelArr);

            //Updating the collaborators of every person involved in the movie
            for(let i = 0; i < populatedPersonnelArr.length; i++){
                // let personOneID = populatedPersonnelArr[i]["_id"];
                let personOneName = populatedPersonnelArr[i].name;
                for(let j = 0; j < populatedPersonnelArr.length; j++){
                    let personTwoID = populatedPersonnelArr[j]["_id"];
                    let personTwoName = populatedPersonnelArr[j].name;
                    if(personOneName === personTwoName){
                        continue;
                    }

                    if(populatedPersonnelArr[i].collaborators){
                        if(populatedPersonnelArr[i].collaborators.has(personTwoName)){
                            let oldCollabaratorCount = populatedPersonnelArr[i].collaborators.get(personTwoID);
                            populatedPersonnelArr[i].collaborators.set(personTwoID, oldCollabaratorCount+1);
                        }

                        else{
                            populatedPersonnelArr[i].collaborators.set(personTwoID, 1);
                        }
                    }
       
                        
                }
                await populatedPersonnelArr[i].save((err) => {if(err) console.log(err)});

        }

        }
    }
       

            
                                                    


async function updateSimilarMovies(movieModel){
    try{
        const genres = [...movieModel.genres];
        let results = []
        //storing results in a map to remove duplicates
        let resultsMap = new Map();
        for(let i = 0; i < movieModel.genres.length; ++i){
            //finding 5 movies that contain all the genres in the genres array that are not the movie to update
            const newResults = await Movie.find({genres: {$all:genres}, title: {$ne:movieModel.title}}).select(["_id", "title"]);
        
            // console.log("New Results: ", newResults);

    
            newResults.forEach( (result) =>{
                resultsMap.set(result.title, result["_id"]);
            })

            if(resultsMap.size >= 5){
                break;
            }

            else{
                genres.pop();
            }
        }

        resultsMap.forEach((value) => {
            results.push(value);
        })
        
        if(results.length > 5){
            results.splice(5,results.length-5)
        }

        // console.log("Results array before mapping:", results);

        //changing the array of objects with IDs to an array of IDs
        results = results.map( (result) => (result["_id"]));

        // console.log("Mapped results array:", results);

        //updating similar movies of the movieModel
  
        // console.log("Movie to Update:", movieToUpdate)
        movieModel.similarMovies = removeDuplicates(results);
        await movieModel.save((err)=>{if(err)console.log(err)});

        //Updating all movies in the movieModel's similar movies array
        for(let i = 0; i < results.length; ++i){
            let movie = await Movie.findOne({_id:results[i]});
            movie.similarMovies = [...movie.similarMovies, movieModel]
            movie.similarMovies = removeDuplicates(movie.similarMovies);
            await movie.save((err)=>{if(err)console.log(err)});
        }
    }

    catch(err){
        console.log(err);
    }

}

async function getMostFrequentCollaborators(personModel){
    try{
        // console.log("Entries:", personModel.collaborators instanceof Map);  
        personModel.collaborators = new Map(Object.entries(personModel.collaborators));
        let sortedMap = new Map([...personModel.collaborators.entries()].sort((a, b) => b[1] - a[1]));
        // console.log("Sorted Frequency map:", sortedMap);
        let mostFrequentCollaborators = []

        for(let person of personModel.collaborators.entries()){
            collabCount = person[1]
            objectID = person[0]
            personNameObj = await Person.findById(objectID).select("name")
            personName = personNameObj.name;
            // console.log("Person name: ", personName);
            // console.log("Count:", collabCount);
            mostFrequentCollaborators.push({name: personName, count: collabCount});
        }

        // console.log("Most Frequent Collaborators: ", mostFrequentCollaborators);
        return mostFrequentCollaborators;
    }

    catch(err){
        console.log(err);
    }

    return null;

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
    const user = await User.findOne({ username });
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
    const movie = await Movie.findOne({  title });
    if(movie){
        const rating = await Review.aggregate([
            {$match:  {movie: movie["_id"]}},
            {$group: {_id: "$movie", average: {$avg : "$rating"}}}
        ]).exec();

        if(rating.length > 0){
            return rating[0].average;
        }


        else{
            return 0;
        }

        
    }
    else{
        return null;
    }
}

async function getReviews(title){
    const movie = await Movie.findOne({  title });
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

// async function test(){
//     console.log(await isContributor("Light"));
// }

// test();


module.exports = {
    addUser,
    addPerson,
    addActor,
    addWriter,
    changeDirector,
    addMovie,
    addReview,
    getMovie, getPerson, getUser, isContributor,
    changeAccountType,
    followUser,
    unfollowUser,
    followPerson,
    unfollowPerson,
    getAverageRating,
    getReviews,
    getMostFrequentCollaborators
}