const assert = require("assert");
let users = {};
let people = {};

let movies = {};
let reviews = {};
let nextReviewID = 0;


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
    if(!userObj.username || !userObj.password){
        return false;
    }
 
    if(users.hasOwnProperty(userObj.username)){
        return false;
    }
 
    userObj.contributor = false;
    userObj.followers = [];
    userObj.usersFollowing = [];
    userObj.peopleFollowing = [];
    userObj.reviews = [];
    userObj.recommendedMovies = [];
    users[userObj.username] = userObj;
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

    //if user1 is following user2, remove user2 from user1's userFollowing list
    if(users[userOneName].usersFollowing.includes(userTwoName)){
        let index = users[userOneName].usersFollowing.find(user=>user.username === userTwoName);
        users[userOneName].usersFollowing.splice(index,1);
    }

    //if user2 is followed by user1, remove user1 from user2's followers list
    if(users[userTwoName].followers.includes(userOneName)){
        let index = users[userTwoName].followers.find(user=>user.username === userOneName);
        users[userTwoName].followers.splice(index,1);
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
            people[personObj.name] = personObj;
            return true;
        }
        return false;
    }
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
            writerObj.works.push(movieTitle);
            writerObj.writer = true;
            
            //Updating collaborators and most frequent collaborators where necessary
            for(let i = 0; i < movies[movieTitle].personnel.length; i++){
               let personObj = people[movies[movieTitle].personnel[i]];
               let personName = personObj.name;
               if(personObj.collaborators.hasOwnProperty(writerName)){
                   if(!movieObj.actors.includes(writerName) && !movieObj.directors.includes(writerName)){
                        personObj.collaborators[writerName]++;
                   }
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
    if(isValidUser(userObj) && isValidPerson(actorObj) && isValidMovie(movies[movieTitle])){
        let actorName = actorObj.name;
        if(userObj.contributor && !movieObj.actors.includes(actorObj.name)){
            
            
            movies[movieTitle].actors.push(actorObj.name);
            actorObj.works.push(movieTitle);
            actorObj.actor = true;
            //updating collaborators and most frequent collaborators where necessary
            for(let i = 0; i < movies[movieTitle].personnel.length; i++){
               let personObj = people[movies[movieTitle].personnel[i]];
               let personName = personObj.name;
               if(personObj.collaborators.hasOwnProperty(actorName)){
                   if(!movieObj.actors.includes(actorName) && !movieObj.directors.includes(actorName)){
                        personObj.collaborators[actorName]++;
                   }
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
            directorObj.works.push(movieTitle);
            directorObj.director = true;
            //updating collaborators and most frequent collaborators where necessary
            for(let i = 0; i < movies[movieTitle].personnel.length; i++){
               let personObj = people[movies[movieTitle].personnel[i]];
               let personName = personObj.name;
               if(personObj.collaborators.hasOwnProperty(directorName)){
                   if(!movieObj.directors.includes(directorName) && !movieObj.directors.includes(directorName)){
                        personObj.collaborators[directorName]++;
                   }
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
        return false;
    }
  

    if(!users[username].contributor && movieObj.hasOwnProperty(movieObj.title) && movies.hasOwnProperty(movieObj.title)){
        return false;
    }

    //return false if the actors, writers and genre attributes are not arrays
    //or if they are empty arrays
    if(Array.isArray(movieObj.directors) && Array.isArray(movieObj.actors) && Array.isArray(movieObj.writers) && Array.isArray(movieObj.genre)){
        if(movieObj.actors.length < 1 || movieObj.writers.length < 1|| movieObj.genre.length < 1){
            return false;
        }
        actors = removeDuplicates(movieObj.actors);
        writers = removeDuplicates(movieObj.writers);
        genre = removeDuplicates(movieObj.genre);
    }

    else{
        return false;
    }

    //Add each actor, writer and director to the movie'spersonnel list
    //and update each person's works and collaborator lists
    //provided the user gives enough information
    if(movieObj.year && movieObj.runtime && movieObj.plot && movieObj.rated
        && typeof(movieObj.rated) === "string" && typeof(movieObj.year) ==="string" && typeof(movieObj.runtime) === "string" &&
         typeof(movieObj.plot) === "string"){
        for(directorName of movieObj.directors){
            if(!isValidPerson(people[directorName])){
                return false;
            }
            movieObj.personnel = [];
            movieObj.personnel.push(directorName);
            people[directorName].director = true;
            if(!people[directorName].works.includes(movieObj.title)){
                people[directorName].works.push(movieObj.title);
            }
        }
 
        
        for(actorName of movieObj.actors){
            if(!isValidPerson(people[actorName])){
                return false;
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
            if(!isValidPerson(people[writerName])){
                return false;
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
            let actorsList = movieObj.actors;
            let writersList = movieObj.writers;
            let directorsList = movieObj.directors;
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
        }

        movieObj.numRatings = 0;
        movieObj.totalRating = 0;
        movieObj.averageRating = 0;
        movieObj.reviews = [];
        movieObj.similarMovies = [];
        movies[movieObj.title] = movieObj;
        updateSimilarMovies();
        return true;
    }
    console.log(7);
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
            
            return false;
        }

    reviewObj.id = nextReviewID++;
    
    if(reviewObj.basic){
        reviewObj.summary = "";
        reviewObj.reviewText = "";
    }

    else if(!reviewObj.summary||!reviewObj.reviewText){
        return false;
        
    }

    else if(typeof(reviewObj.summary)!== "string" || typeof(reviewObj.reviewText)!=="string"){
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
    results = [];
    let userObj = users[username]
    for(reviewID in userObj.reviews){
        let reviewObj = reviews[reviewID]
        if(reviewObj.rating >= 8){
            for(movieName of movies[reviewObj.movieTitle].similarMovies){
                results.push(movieName);
            }
        }
    }
    users[username].recommendedMovies = removeDuplicates(results);
}

/*
This function updates the similar movies of every movie object in the database
Similarity, for now, is based on rated (R, G, PG13 etc)
It is called whenever a new movie is added

Input: none
Output: none

*/
function updateSimilarMovies(){
    let movieKeys = Object.keys(movies);
    for(let i = 0; i < movieKeys.length; i++){
        for(let j = 0; j < movieKeys.length; j++){
            if(movieKeys[i] === movieKeys[j]){
                continue;
            }

            else if(movies[movieKeys[i]].rated === movies[movieKeys[j]].rated 
                && !movies[movieKeys[i]].similarMovies.includes(movieKeys[j])){
                    movies[movieKeys[i]].similarMovies.push(movieKeys[j]);
            }
        }
    }
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
        if(movie.includes(title)){
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
    for(movie in movies){
        if(movies[movie].year === String(year)){
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

console.log("Testing functions");

//There should be 10 users. 5 of them should be contributing users
createUser({username:"Jola", password: "tears"});
changeAccountType("Jola");

createUser({username:"Dave", password: "joy"});
changeAccountType("Dave");

createUser({username:"Lelouch", password: "codegeass"});
changeAccountType("Lelouch");

createUser({username:"Light", password: "deathnote"});
changeAccountType("Light");

createUser({username:"Luffy", password: "onepiece"});
changeAccountType("Luffy");

createUser({username:"Ichigo", password: "bleach"});
createUser({username:"Naruto", password: "naruto"});
createUser({username:"Goku", password: "dbz"});
createUser({username:"Asta", password: "blackclover"});
createUser({username:"Midoriya", password: "mha"});
createUser({username:"notGonnaWork"});


//There should be 10 users, Ichigo is not a contributor.
addPerson(users["Jola"], {name:"Actor 1"});
addPerson(users["Jola"], {name:"Actor 2"});
addPerson(users["Jola"], {name:"Actor 3"});
addPerson(users["Jola"], {name:"Actor 4"});
addPerson(users["Jola"], {name:"Actor 5"});
addPerson(users["Jola"], {name:"Director 1"});
addPerson(users["Jola"], {name:"Director 2"});
addPerson(users["Jola"], {name:"Writer 1"});
addPerson(users["Jola"], {name:"Writer 2"});
addPerson(users["Jola"], {name:"Writer 3"});
addPerson(users["Ichigo"], {name:"Writer 4"});


//Testing Movie functions
addMovie("Jola", {title:"Movie 1", directors:["Director 1"], actors:["Actor 1", "Actor 1", "Actor 2"], writers:["Writer 1", "Writer 3"], genre:["Action","Action", "Adventure"], year:"2001", runtime:"80 min", plot:"Boring", rated:"G"});

addMovie("Jola", {title:"Movie 2", directors:["Director 2", "Actor 1"], actors:["Actor 2", "Actor 2", "Actor 3"], writers:["Writer 3","Writer 2"], genre:["Action","Drama", "Adventure"], year: "2001", runtime:"80 min", plot:"Boring", rated:"G"});

addMovie("Jola", {title:"Movie 3", directors:["Director 2"], actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1","Writer 3","Writer 2"], genre:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"});

addMovie("Jola", {title:"Movie 4", directors:["Director 1"], actors:["Actor 1", "Actor 3"], writers:["Writer 1","Writer 3"], genre:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"});

addDirector(users["Jola"], people["Actor 2"], "Movie 1");
addActor(users["Jola"], people["Director 2"], "Movie 4");
addWriter(users["Jola"], people["Actor 3"], "Movie 3");

//Testing writeReview()
writeReview({rating:10, movieTitle:"Movie 1", basic:true, reviewer:"Jola"});
writeReview({rating:8, movieTitle:"Movie 2", basic:false, reviewer:"Lelouch", summary:"Didn't like it", reviewText: "The truth is, I didn't like this movie"});
writeReview({rating:8, movieTitle:"Movie 2", basic:true, reviewer:"Jola"});
writeReview({rating:3, movieTitle:"Movie 4", basic:true, reviewer:"Lelouch"});
writeReview({rating:4, movieTitle:"Movie 3", basic:true, reviewer:"Lelouch"});

console.log(users["Jola"]);
console.log(users["Lelouch"]);
console.log(people["Actor 1"]);
console.log(movies);


console.log("addMovies() function passed!");

//Testing search functions
console.log("Search results for 'Act' genre:",searchMoviesByGenre("Act"));
console.log("Search results for 'Movie' title:",searchMoviesByTitle("Movie"));
console.log("Search results for 'Movie 1' title:",searchMoviesByTitle("Movie 1"));
console.log("Search results for '2001' year:", searchMoviesByYear("2001"));
console.log("Search results for min rating of 8", searchMoviesByMinRating(8),"\n\n");

assert(isValidUser(users["Jola"]) == true, "Incorrect output for isValidUser()");
assert(isValidUser(users["Nobody"]) == false, "Incorrect output for isValidUser()");

assert(isValidPerson(people["Actor 1"]) == true, "Incorrect output for isValidPerson() test 1");
assert(isValidPerson(people["Nobody"]) == false, "Incorrect output for isValidPerson() test 2");

assert(isValidMovie(movies["Movie 1"]) == true, "Incorrect output for isValidMovie() test 1");
assert(isValidMovie(movies["Unlisted"]) == false, "Incorrect output for isValidMovie() test 2");

assert(isValidReview(reviews[0]) == true, "Incorrect output for isValidReview() test 1");
assert(isValidReview(reviews[5]) == false, "Incorrect output for isValidReview() test 2");

assert(getUser("Jola","Jola") == users["Jola"], "Incorrect user test 1");
assert(getUser("Jola","Nobody") == null, "Incorrect user test 2");

assert(getPerson("Actor 1") == people["Actor 1"], "Incorrect person test 1");
assert(getPerson("Nobody") == null, "Incorrect person test 2");

assert(getMovie("Movie 1") == movies["Movie 1"], "Incorrect movie test 1");
assert(getMovie("Unlisted") == null, "Incorrect movie test 2");

assert(getReview(0) == reviews[0], "Incorrect review test 1");
assert(getReview(5) == null, "Incorrect review test 2");

console.log("isValidUsers() function: Test passed!");
console.log("isValidPerson() function: Test passed!");
console.log("isValidMovie() function: Test passed!");
console.log("isValidReview() function: Test passed!");
console.log("getUsers() function: Test passed!");
console.log("getPerson() function: Test passed!");
console.log("getMovie() function: Test passed!");
console.log("getReview() function: Test passed!");





//Testing number of users
assert(Object.keys(users).length === 10, "Unexpected number of users");
console.log("createUsers() function: Test passed!");


//Testing number of contributors
assert(Object.keys(users).filter(key => users[key].contributor).length ===5, "Unexpected number of contributors");
console.log("changeAccountType() function: Test passed!");


//Testing number of people
assert(Object.keys(people).length === 10 && !people.hasOwnProperty("Writer 4"), "Unexpected number of people");
console.log("addPeople() function: Test passed!");


//Each user should have Jola as a follower
let jolaFollowing = []   //list to be used to test usersFollowing attribute of Jola


for(let user of Object.keys(users)){
    if(user === "Jola"){
        continue;
    }
    //Testing followUser() function
    followUser("Jola", user);
    assert(JSON.stringify(users[user].followers) === JSON.stringify(['Jola']), "Unexpected number of followers");

    //Testing followPerson() function
    followPerson(user, "Actor 1");
    assert(JSON.stringify(users[user].peopleFollowing === JSON.stringify(["Actor 1"])), "Unexpected number of people following");

    unfollowPerson(user, "Actor 1");
    assert(users[user].peopleFollowing.length == 0, "Unexpected number of people following")
    jolaFollowing.push(user);
  
}

console.log("followPerson() function: Test passed!");

//Testing usersFollowing attribute
assert(JSON.stringify(users["Jola"].usersFollowing) === JSON.stringify(jolaFollowing), "Unexpected number of followers");
console.log("followUsers() function: Test passed!");







for(let user of Object.keys(users)){
    if(user === "Jola"){
        continue;
    }
    //Testing unfollowUser function
    unfollowUser("Jola", user);

    //Testing followers attribute
    assert(users[user].followers.length == 0, "Unexpected number of followers");
}

console.log("unfollowUsers() function: Test passed!");






