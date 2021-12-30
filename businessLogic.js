
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


let oldMovies = require("./movie-data-short.json");
let movies = {};
let users = {};
let people = {};
let reviews = {};
let nextReviewID = 0;
let validRatings = ["PG-13", "PG", "R", "G", "Not Rated", "Unrated", "N/A", "TV-14", "TV-Y", "TV", "13+","14A",
 "16+", "18A", "18+", "R", "A", "TV-Y", "TV-G", "TV-Y7", "TV-Y7-FV", "TV-PG", "NC-17", "TV-MA"];

//Initialization script
createUser({username:"Jola", password: "tears"});
changeAccountType("Jola");

createUser({username:"Dave", password: "joy"});
createUser({username:"Lelouch", password: "codegeass"});
changeAccountType("Lelouch");

createUser({username:"Light", password: "deathnote"});
createUser({username:"Luffy", password: "onepiece"});

followUser("Jola", "Dave");
followUser("Jola", "Light");

followUser("Dave", "Luffy");
followUser("Dave", "Jola");

followUser("Luffy", "Dave");
followUser("Luffy", "Jola");

followUser("Light", "Lelouch");
followUser("Light", "Jola");

let counter = 0;
for(movie of oldMovies){
    
    let writers = movie.Writer.split(", ");    
    let actors = movie.Actors.split(", ");
    let directors = movie.Director.split(",");

    //Remove whitespaces
    writers = writers.map(writer => writer.trim());
    actors = actors.map(actor => actor.trim());
    directors = directors.map(director => director.trim());

    //Ignore movies where movie personnel are listed as N/A
    if(actors.includes("N/A")||directors.includes("N/A")||writers.includes("N/A")){
        continue;
    }

    for(actor of actors){
        addPerson(users["Jola"], {name:actor});
    }

    //Remove brackets from writer's name e.g Jack Black (screenplay by) becomes Jack Black
    for(let i = 0; i < writers.length; i++){
        let bracket = writers[i].indexOf("(");
        if(bracket > 1){
            writers[i] = writers[i].substring(0, writers[i].indexOf("(")).trim();
        }
        addPerson(users["Jola"], {name:writers[i]});
    }

    for(director of directors){
        addPerson(users["Jola"], {name:director});
    }

 
    //Remove " mins" from the runtime so it can be converted to an integer
    let processedRuntime = movie.Runtime.slice(0,-4);
    if(addMovie("Jola", {title:movie.Title,
         directors:directors,
          actors:actors,
           writers:writers, 
           genres:movie.Genre.split(","),
            year: Number(movie.Year), 
            runtime:Number(processedRuntime),
             plot:String(movie.Plot),
              rated:String(movie.Rated), 
              poster:movie.Poster})){
                  counter++;
              }
}
console.log("There are", counter, "movies"); 

//Uncomment this line to see which people have collaborated with more than 2 people
// for(person in people){
//     let personObj = people[person];
//     if(personObj.collaborators[personObj.mostFrequentCollaborators[0]] >= 2){
//         console.log(personObj);
//     }
// }  
//returns ["Cem Yilmaz", "Zafer Algoz", "Alex van Warmerdam", "Gene Bervoets", "Stephen J. Rivele", "Christopher Wilkinson", "Zac Efron", "Andrew Jay Cohen", "Brendan O' Brien", "Ethan Coen", "Joel Coen"]



followPerson("Jola","Zac Efron");
followPerson("Jola", "Sylvester Stallone");
followPerson("Dave", "Idris Elba");
followPerson("Dave", "Jack Black");

writeReview({rating:10, movieTitle:"Hotel Transylvania 2", basic:false, reviewer:"Jola", summary:"So good", reviewText: "Reminded me of when days were simpler and I didn't have to deal with all these deadlines"});
writeReview({rating:4, movieTitle:"Approaching the Unknown",  basic:false, reviewer:"Jola", summary:"So bad", reviewText: "Almost broke my TV watching this"});
writeReview({rating:10, movieTitle:"Finding Dory",  basic:false, reviewer:"Dave", summary:"Loved it", reviewText: "Good plot, good fight scenes"});
writeReview({rating:"2", movieTitle:"I am Wrath", basic:false, reviewer:"Dave", summary:"Didn't like it", reviewText: "The truth is, I didn't like this movie"});

//Every user gives a random rating from 1 to 10 for every movie
for(movie in movies){
    for(user in users){
        let rating = Math.floor(Math.random()*10)+1;
        writeReview({rating:rating, movieTitle:movie, basic:true, reviewer:user});
    }
}

//Resetting the notifications of everybody so they don't get spammed
for(user in users){
    users[user].notifications = [];
}

//This function verifies user login details
function verifyUser(username, password){
    return users.hasOwnProperty(username) && users[username].password === password;
}


/*
This function checks whether a user object is valid
Input: userObj: User object
Output: boolean representing whether the user object is valid or not
*/
function isValidUser(userObj){ 
    if(!userObj){   
        return false;
    }

    if(!userObj.username|| !users.hasOwnProperty(userObj.username)){
        return false;
    }

    return true;
}

/*
This function retrieves a user object with a specified username.

Input: requestingUser(not used currently but could be useful if authentication is added in the future)
       username 
       username: username of the user to be retrieved
Output: user object with specified username if possible. Null otherwise.


*/
function getUser(requestingUser, username){
    if(!users.hasOwnProperty(username)){
        return null;
    }
    return users[username];
}
/*
This function initializes user attributes of a new user object and 
adds the user to the users object if it is valid

Input: userObj: User object containing only username and password attributes

Output: boolean representing whether the user was successfully added or not

A user is added sucessfully if:
The username of the user is not taken
The user object is valid (has a username and password attribute)
*/
function createUser(userObj){
    return
    // newUser = new User(userObj);
    // newUser.save((err, result) => {
    //     if(err){
	// 		console.log(err);
	// 		return false;
	// 	}
    // })
    // return true;
}

 /*
This function adds userTwo to userOne's userFollowing list and
adds userOne to userTwo's followers list

Input: user1: the username of user that is following another user object
       user2 :the username of user that is being followed by another user object
Output: Boolean representing whether the lists were properly updated


*/
function followUser(userOneName, userTwoName){
    if(!isValidUser(users[userOneName]) || !isValidUser(users[userTwoName])){
        return false;
    }

    if(userOneName === userTwoName){
        return false;
    }

    //if user 1 is already following user 2
    if(users[userOneName].usersFollowing.includes(userTwoName)){
        return false;
    }

    //if user 2 is already followed by user 1
    if(users[userTwoName].followers.includes(userOneName)){
        return false;
    }

    users[userOneName].usersFollowing.push(userTwoName);
    users[userTwoName].followers.push(userOneName);
    return true;
}

/*
This function removes userTwo from userOne's userFollowing list and
removes userOne from userTwo's followers list

Input: user1: the username of user that is unfollowing another user object
       user2 :the username of user that is being unfollowed by another user object
Output: Boolean representing whether the lists were updated


*/
function unfollowUser(userOneName, userTwoName){
    if(!isValidUser(users[userOneName]) || !isValidUser(users[userTwoName])){
        return false;
    }

    if(userOneName === userTwoName){
        return false;
    }

    let userOneFollowingTwo = users[userOneName].usersFollowing.indexOf(userTwoName);
    let userTwoFollowedByOne = users[userTwoName].followers.indexOf(userOneName);

    if(userOneFollowingTwo > -1 && userTwoFollowedByOne > -1){
        users[userOneName].usersFollowing.splice(userOneFollowingTwo, 1);
        users[userTwoName].followers.splice(userTwoFollowedByOne, 1);
        return true;
    }

    return false;
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
    if(isValidUser(users[username])){
        users[username].contributor = !users[username].contributor;
    }
}


/*
This function checks whether a user object is valid
Input: personObj: person object
Output: boolean representing whether the user object is valid or not
*/
function isValidPerson(personObj){ 
    if(!personObj){   
        return false;
    }

    if(!personObj.name|| !people.hasOwnProperty(personObj.name)){
        return false;
    }

    return true;
}

/*
This function retrieves a person object if it is part of the database

Input: personName
Output: person object with the specified name (null if DNE)


*/
function getPerson(personName){
    if(!people.hasOwnProperty(personName)){
        return null;
    }
    return people[personName];
}



/*
This function adds a person to a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
function followPerson(username, personName){
    if(!isValidUser(users[username]) || !isValidPerson(people[personName])){
        return false;
    }

    //If the user is already following the person
    if(users[username].peopleFollowing.includes(personName)){
        return false;
    }

    users[username].peopleFollowing.push(personName);
    people[personName].followers.push(username);
    return true;
}



/*
This function removes a person from a user's peopleFollowing list

Input: username: username of the user
       personName: name of the person
Output: Boolean representing whether the lists were updated


*/
function unfollowPerson(username, personName){
    if(!isValidUser(users[username]) || !isValidPerson(people[personName])){
        return false;
    }

    if(users[username].peopleFollowing.includes(personName)){
        let index = users[username].peopleFollowing.find(person => person.name === personName);
        users[username].peopleFollowing.splice(index, 1);
        index = people[personName].followers.find(user => user.name == username);
        people[personName].followers.splice(index, 1);
        return true;
    }


    return false;
}


/*
This function checks whether a movie object is valid
Input: movieObj: movie object
Output: boolean representing whether the movie object is valid or not
*/

function isValidMovie(movieObj){
    if(!movieObj){
        return false;
    }

    if(!movies.hasOwnProperty(movieObj.title)){
        return false;
    }

    return true;
}



/*
This function retrieves a movie object if it is part of the database

Input: movieTitle
Output: movie object with the specified name (null if DNE)


*/
function getMovie(movieTitle){
    if(!movies.hasOwnProperty(movieTitle)){
        return null;
    }

    return movies[movieTitle];
}

/*
This function adds a user to the database provided the user adding them is valid
and enough information about the person has been provided

Input: userObj: user object
       personObj: person object
Output: boolean representing whether the person was successfully added or not


*/
function addPerson(userObj, personObj){
    if(isValidUser(userObj) && userObj.contributor){
        if(personObj.name && !people.hasOwnProperty(personObj.name)){
            personObj.director = false;
            personObj.actor = false;
            personObj.writer = false;
            personObj.works = [];
            personObj.collaborators = {};
            personObj.mostFrequentCollaborators = [];
            personObj.followers = [];
            people[personObj.name] = personObj;
            return true;
        }
        // console.log(1);
        return false;
    }
    // console.log(2);
    return false;
}

/*
This function adds a writer to a movie and updates the works of the writer as well
as the collaborators and most frequent collaborators of everyone involved

Input: userObj: user object
       writerObj: person object with writer property set to true
       movieTitle: movie title
Output: Boolean representing whether the writer was successfully added or not


*/
function addWriter(userObj, writerObj, movieTitle){
    let movieObj = movies[movieTitle];
    if(isValidUser(userObj) && isValidPerson(writerObj) && isValidMovie(movies[movieTitle])){
        let writerName = writerObj.name;
        if(userObj.contributor && !movieObj.writers.includes(writerName)){
            movies[movieTitle].writers.push(writerObj.name);
            if(!writerObj.works.includes(movieTitle)){
                writerObj.works.push(movieTitle);
            }

            writerObj.writer = true;
            
            if(!movieObj.personnel.includes(writerObj.name)){
                //Updating collaborators and most frequent collaborators where necessary
                for(let i = 0; i < movies[movieTitle].personnel.length; i++){
                let personObj = people[movies[movieTitle].personnel[i]];
                let personName = personObj.name;
                if(personObj.collaborators.hasOwnProperty(writerName)){
                    personObj.collaborators[writerName]++;
                }

                else{
                    personObj.collaborators[writerName] = 1;
                }

                if(writerObj.collaborators.hasOwnProperty(personName)){
                    writerObj.collaborators[personName]++;
                }

                else{
                    writerObj.collaborators[personName] = 1;
                }

                updateMostFrequentCollaborators(personObj.name);
                
                }

                updateMostFrequentCollaborators(writerObj.name);
                movies[movieTitle].personnel.push(writerObj.name);
                
            }
            
            for(let i = 0; i < writerObj.followers.length; i++){
                let followerName = writerObj.followers[i];
                users[followerName].notifications.push(writerName+" was added to "+ movieTitle);
            }
            return true;
        }
        return false;
        
    }

    return false;
}


/*
This function adds an actor to a movie and updates the works of the actor as well
as the collaborators and most frequent collaborators of everyone involved

Input: userObj: user object
       actorObj: person object with actor property set to true
       movieTitle: movie title
Output: Boolean representing whether the writer was successfully added or not


*/
function addActor(userObj, actorObj, movieTitle){
    // console.log(actorObj);
    let movieObj = movies[movieTitle];
    // console.log(movieTitle);
    // console.log(userObj.username, isValidUser(userObj));
    // console.log(actorObj.name, isValidPerson(actorObj));
    // console.log(movieObj.title, isValidMovie(movieObj));
    if(isValidUser(userObj) && isValidPerson(actorObj) && isValidMovie(movies[movieTitle])){
        let actorName = actorObj.name;
        if(userObj.contributor && !movieObj.actors.includes(actorObj.name)){
            
            
            movies[movieTitle].actors.push(actorObj.name);
            if(!actorObj.works.includes(movieTitle)){
                actorObj.works.push(movieTitle);
            }
            
            actorObj.actor = true;
            if(!movieObj.personnel.includes(actorObj.name)){
            //updating collaborators and most frequent collaborators where necessary
                for(let i = 0; i < movies[movieTitle].personnel.length; i++){
                    let personObj = people[movies[movieTitle].personnel[i]];
                    let personName = personObj.name;
                    if(personObj.collaborators.hasOwnProperty(actorName)){
                        personObj.collaborators[actorName]++;
                    }

                    else{
                        personObj.collaborators[actorName] = 1;
                    }

                    if(actorObj.collaborators.hasOwnProperty(personName)){
                        actorObj.collaborators[personName]++;
                    }

                    else{
                        actorObj.collaborators[personName] = 1;
                    }

                    updateMostFrequentCollaborators(personObj.name);
                }

                updateMostFrequentCollaborators(actorObj.name);
                movies[movieTitle].personnel.push(actorObj.name);
            }
            
            for(let i = 0; i < actorObj.followers.length; i++){
                let followerName = actorObj.followers[i];
                users[followerName].notifications.push(actorName +" was added to " + movieTitle);
            }

            return true;
        }
        return false;        
    }
    
    return false;
}


/*
This function adds a director to a movie and updates the works of the director as well
as the collaborators and most frequent collaborators of everyone involved

Input: userObj: user object
       directorObj: person object with director property set to true
       movieTitle: movie title
Output: Boolean representing whether the writer was successfully added or not


*/
function addDirector(userObj, directorObj, movieTitle){
    let movieObj = movies[movieTitle];
    if(isValidUser(userObj) && isValidPerson(directorObj) && isValidMovie(movies[movieTitle])){
        let directorName = directorObj.name;
        if(userObj.contributor && !movieObj.directors.includes(directorObj.name)){
            
            
            movies[movieTitle].directors.push(directorObj.name);
         

            if(!directorObj.works.includes(movieTitle)){
                directorObj.works.push(movieTitle);
            }
            
            directorObj.director = true;
            if(!movies[movieTitle].personnel.includes(directorObj.name)){
            //updating collaborators and most frequent collaborators where necessary
                for(let i = 0; i < movies[movieTitle].personnel.length; i++){
                let personObj = people[movies[movieTitle].personnel[i]];
                let personName = personObj.name;
                if(personObj.collaborators.hasOwnProperty(directorName)){
                    personObj.collaborators[directorName]++;
                    
                }

                else{
                    personObj.collaborators[directorName] = 1;
                }

                if(directorObj.collaborators.hasOwnProperty(personName)){
                    directorObj.collaborators[personName]++;
                }

                else{
                    directorObj.collaborators[personName] = 1;
                }

                updateMostFrequentCollaborators(personObj.name);
                }

                updateMostFrequentCollaborators(directorObj.name);
                movies[movieTitle].personnel.push(directorObj.name);
                
            }

            for(let i = 0; i < directorObj.followers.length; i++){
                let followerName = directorObj.followers[i];
                users[followerName].notifications.push(directorName+" was added to "+movieTitle);
            }
            return true;
        }
        return false;
        
    }

    return false;
}


/*
This function updates the most frequent collaborators of a person object given a person name

Input: personName: name property of a person object
Output: none


*/
function updateMostFrequentCollaborators(personName){
    let person = people[personName];
    person.mostFrequentCollaborators = Object.keys(person.collaborators).sort(function(a, b){
        return person.collaborators[b]-person.collaborators[a];
    })

    person.mostFrequentCollaborators = person.mostFrequentCollaborators.slice(0,5);
}



/*
This function adds a movie to the database given the required information. It also updates
collaborator and most frequent collaborator properties of all person objects involved in the movie. 

Input: username: username of the contributing user adding the movie
       movieObj: the movie object to be added to the database
Output: Boolean representing whether the moviewas successfully added or not


*/
function addMovie(username, movieObj){
    if(!isValidUser(users[username])){
        // console.log(username, "is not a valid user");
        // console.log(1);
        return false;
    }
  

    if(!users[username].contributor || movies.hasOwnProperty(movieObj.title)){
        // console.log(2);
        return false;
    }

    if(!validRatings.includes(movieObj.rated)){
        // console.log("valid ratings does not include", movieObj.rated);
        return false;
    }

    //return false if the actors, writers and genre attributes are not arrays
    //or if they are empty arrays
    if(Array.isArray(movieObj.directors) && Array.isArray(movieObj.actors) && Array.isArray(movieObj.writers) && Array.isArray(movieObj.genres)){
        if(movieObj.actors.length < 1 || movieObj.writers.length < 1|| movieObj.genres.length < 1){
            // console.log(3);
            return false;
        }
        actors = removeDuplicates(movieObj.actors);
        writers = removeDuplicates(movieObj.writers);
        genres = removeDuplicates(movieObj.genres);
    }

    else{
        // console.log(4);
        return false;
    }

    //Add each actor, writer and director to the movie'spersonnel list
    //and update each person's works and collaborator lists
    //provided the user gives enough information

    // console.log(typeof(movieObj.rated));
    // console.log(typeof(movieObj.plot));
    // console.log(typeof(movieObj).runtime);
    // console.log(typeof(movieObj).year);

    try{
        movieObj.runtime = Number(movieObj.runtime);
        movieObj.year = Number(movieObj.year);
    }

    catch{
        // console.log("failed because of type checking");
        return false;
    }

    if(movieObj.year && movieObj.runtime && movieObj.plot && movieObj.rated
        && typeof(movieObj.rated) === "string" && typeof(movieObj.plot) === "string"){
        movieObj.personnel = [];
        for(directorName of movieObj.directors){
            if(!people.hasOwnProperty(directorName)){
                addPerson(users[username], {name:directorName});
            }
            
            movieObj.personnel.push(directorName);
            people[directorName].director = true;
            if(!people[directorName].works.includes(movieObj.title)){
                people[directorName].works.push(movieObj.title);
            }
        }
 
        
        for(actorName of movieObj.actors){
            // if(!isValidPerson(people[actorName])){
            //     // console.log(6);
            //     return false;
            // }

            if(!people.hasOwnProperty(actorName)){
                addPerson(users[username], {name:actorName});
            }

            people[actorName].actor = true;
            if(!people[actorName].works.includes(movieObj.title)){
                people[actorName].works.push(movieObj.title);
            }

            if(!movieObj.personnel.includes(actorName)){
                movieObj.personnel.push(actorName);
            }
                
        }
        
        for(writerName of movieObj.writers){
            if(!people.hasOwnProperty(writerName)){
                addPerson(users[username], {name:writerName});
            }

            people[writerName].writer = true;

            if(!people[writerName].works.includes(movieObj.title)){
                people[writerName].works.push(movieObj.title);
            }


            if(!movieObj.personnel.includes(writerName)){
                movieObj.personnel.push(writerName);
            }
                
        }

        //Updating the collaborators of every person involved in the movie
        for(let i = 0; i < movieObj.personnel.length; i++){
            let personOneName = movieObj.personnel[i];
            for(let j = 0; j < movieObj.personnel.length; j++){
                let personTwoName = movieObj.personnel[j];
                if(personOneName === personTwoName){
                    continue;
                }
                if(people[personOneName].collaborators.hasOwnProperty(personTwoName)){
                    people[personOneName].collaborators[personTwoName]++;
                }
                else{
                    people[personOneName].collaborators[personTwoName] = 1;
                }
                    
            }
        }

        //Updating the most frequent collaborators of each person in the movie
        for(let i = 0; i < movieObj.personnel.length; i++){
            updateMostFrequentCollaborators(movieObj.personnel[i]);
            // console.log(people[movieObj.personnel[i]], people[movieObj.personnel[i]].collaborators);
        }

        movieObj.numRatings = 0;
        movieObj.totalRating = 0;
        movieObj.averageRating = 0;
        movieObj.reviews = [];
        movieObj.similarMovies = [];
        movies[movieObj.title] = movieObj;
        updateSimilarMovies();

        
        for(let i = 0; i < movieObj.personnel.length; i++){
            for(let j = 0; j < people[movieObj.personnel[i]].followers.length; j++){;
                let followerName = people[movieObj.personnel[i]].followers[j];
                users[followerName].notifications.push(movieObj.personnel[i] + " was added to "+ movieObj.title);
                // console.log(users[followerName].notifications);
            }
        }
        return true;
    }
    // console.log("type of", movieObj.rated, typeof(movieObj.rated));
    // console.log("type of", movieObj.plot, typeof(movieObj.plot));
    // console.log("movie.rated", movieObj.rated);
    // console.log("movie.runtime", movieObj.runtime);
    // console.log("movie.plot", movieObj.plot);
    // console.log("movie.year", movieObj.year);
    return false;
}


/*
This function retrieves a review object if it is part of the database

Input: reviewID
Output: review object with the specified ID (null if DNE)


*/

function getReview(reviewID){
    if(!reviews.hasOwnProperty(reviewID)){
        return null;
    }
    return reviews[reviewID];
}


/*
This function checks whether a review object is valid
Input: reviewObj: review object
Output: boolean representing whether the review object is valid or not
*/
function isValidReview(reviewObj){
    if(!reviewObj){
        return false;
    }

    if(!reviewObj.hasOwnProperty("id")){
        return false;
    }

    return true;
}

/*
This function adds a review to the database given the required information. 

Input: reviewObj: the review object to be added
Output: Boolean representing whether the moviewas successfully added or not


*/
function writeReview(reviewObj){
    if(!reviewObj || !reviewObj.hasOwnProperty("rating")||!isValidMovie(movies[reviewObj.movieTitle])
        ||!reviewObj.hasOwnProperty("basic")||!isValidUser(users[reviewObj.reviewer])){
            // console.log(1);
            return false;
        }

    reviewObj.id = nextReviewID++;
    
    if(reviewObj.basic){
        reviewObj.summary = "";
        reviewObj.reviewText = "";
    }

    else if(!reviewObj.summary||!reviewObj.reviewText){
        // console.log(2);
        return false;
    }

    else if(typeof(reviewObj.summary)!== "string" || typeof(reviewObj.reviewText)!=="string"){
        // console.log(3);
        return false;
        
    }


    reviewObj.rating = Number(reviewObj.rating);

    if(isNaN(reviewObj.rating) || reviewObj.rating > 10 || reviewObj.rating < 0){
        // console.log(4);
        return false;
    }


    let movie = movies[reviewObj.movieTitle]
    movie.reviews.push(reviewObj.id);
    movie.numRatings++;
    movie.totalRating += reviewObj.rating;
    movie.averageRating = movie.totalRating/movie.numRatings;
    users[reviewObj.reviewer].reviews.push(reviewObj.id);
    reviews[reviewObj.id] = reviewObj;
    updateRecommendedMovies(reviewObj.reviewer);

    for(let i = 0; i < users[reviewObj.reviewer].followers.length; i++){
        let followerName = users[reviewObj.reviewer].followers[i];
        users[followerName].notifications.push(reviewObj.reviewer+" added a review to " + reviewObj.movieTitle);
    }
    return true;
}


/*
This function updates the recommended movies of a user.
If a user gives a review of 8 and above on a movie, similar movies to that movie are recommended.
This function is called every time the user with the specified username adds a review

Input: username: username of the user object to whom movies are recommended
  
Output: none;


*/
function updateRecommendedMovies(username){
    let results = [];
    let NUM_RECOMMENDED_MOVIES = 20;
    let userObj = users[username]
    for(reviewID of userObj.reviews){
        let reviewObj = reviews[reviewID]
        if(reviewObj.rating >= 8){
            for(movieName of movies[reviewObj.movieTitle].similarMovies){
                if(results.length < NUM_RECOMMENDED_MOVIES){
                    results.push(movieName);
                }
            }   
        }
    }
    userObj.recommendedMovies = removeDuplicates(results);
}

/*
This function updates the similar movies of every movie object in the database
Similarity is determined using Jaccard's index
It is called whenever a new movie is added

Input: none
Output: none

*/
function updateSimilarMovies(){
    let movieKeys = Object.keys(movies);
    for(let i = 0; i < movieKeys.length; i++){
        let movieOne = movies[movieKeys[i]];
        for(let j = 0; j < movieKeys.length; j++){
            if(movieKeys[i] === movieKeys[j]){
                continue;
            }

            let movieTwo = movies[movieKeys[j]];

            if(calculateJaccardIndex(movieOne.genres, movieTwo.genres) > 50 && movieOne.rated === movieTwo.rated){
                movies[movieOne.title].similarMovies.push(movieTwo.title);
                movies[movieTwo.title].similarMovies.push(movieOne.title);

            }
            movies[movieTwo.title].similarMovies = removeDuplicates(movies[movieTwo.title].similarMovies);
        }
        movies[movieOne.title].similarMovies = removeDuplicates(movies[movieOne.title].similarMovies);
    }
}


/*
This function returns an array of users that match the specified username

Input: username: username of user to be searched for
Output: array of users that match the specified username

*/
function searchUsers(username){
    let results = [];
    for(user in users){
        if(users[user].username.toLowerCase().includes(username.toLowerCase())){
            results.push(user);
        }
    }
    return results;
}

/*
This function returns an array of users that match the specified username

Input: username: username of user to be searched for
Output: array of users that match the specified username

*/
function searchPeople(personName){
    let results = [];
    for(person in people){
        if(people[person].name.toLowerCase().includes(personName.toLowerCase())){
            results.push(person);
        }
    }
    return results;
}

/*
This function returns an array of movie titles that match the specified genre

Input: genre: genre of movie to be searched for
Output: array of movie titles that match the specified genre

*/
function searchMoviesByGenre(genre){
    let results = [];
    for(movie in movies){
        if(movies[movie].genre.join(" ").toLowerCase().includes(genre.toLowerCase())){
            results.push(movie);
        }
    }
    return results;
}

/*
This function returns an array of movie titles that match the specified title

Input: title: title of movie to be searched for
Output: array of movie titles that match the specified title

*/
function searchMoviesByTitle(title){
    let results = [];
    for(movie in movies){
        if(movie.toLowerCase().includes(title.toLowerCase())){
            results.push(movie);
        }
    }

    return results;
}

/*
This function returns an array of movie titles that match the specified year

Input: year: year of movie to be searched for
Output: array of movie titles that match the specified year

*/
function searchMoviesByYear(year){
    let results = [];

    try{
        year = Number(year);
    }
    catch{
        return results;
    }

    for(movie in movies){
        if(Number(movies[movie].year) === year){
            results.push(movie);
        }
        
    }
    return results;
}
/*
This function returns an array of movie titles whose average rating are at least that of the
specified minimum rating

Input: minRating: minimum rating of movie to be searched for
Output: array of movie titles that match the search parameters

*/

function searchMoviesByMinRating(minRating){
    let results = [];
    for(movie in movies){
        if(movies[movie].averageRating >= minRating){
            results.push(movie);
        }
    }
    return results;
}

/*
This function removes duplicates from an array

Input: lst: an array with duplicates
Output: an array without duplicates

*/
function removeDuplicates(lst){
    lst = new Set(lst);
    lst = Array.from(lst);
    return lst;
}

/*
This function calculates the Jaccard Index of two list

Input: lst1, lst2: arrays
Output: an array without duplicates

*/
function calculateJaccardIndex(lst1, lst2){
    lst1 = new Set(lst1);
    lst2 = new Set(lst2);
    intersection = new Set();
    union = new Set();
    for(element of lst1){
        union.add(element);
        if(lst2.has(element)){
            intersection.add(element);
        }
    }

    for(element of lst2){
        union.add(element);
    }

    return (intersection.size/union.size)*100;
}


module.exports = {
    db,
    createUser,
    addPerson,
    addMovie,
    writeReview,
    addDirector,
    addWriter,
    addActor,
    getUser,
    getMovie,
    getPerson,
    getReview,
    isValidUser,
    isValidPerson,
    isValidReview,
    isValidMovie,
    followPerson,
    unfollowPerson,
    followUser,
    unfollowUser,
    searchUsers,
    searchPeople,
    searchMoviesByGenre,
    searchMoviesByMinRating,
    searchMoviesByTitle,
    searchMoviesByYear,
    updateSimilarMovies,
    updateRecommendedMovies,
    updateMostFrequentCollaborators,
    removeDuplicates,
    verifyUser,
    movies,
    users,
    people,
    reviews,
    nextReviewID,
    changeAccountType
}
