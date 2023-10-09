const assert = require("assert");
const model = require("./businessLogic");
model.users = {};
model.people = {};

model.movies = {};
model.reviews = {};
model.nextReviewID = 0;

const users = model.users;
const people = model.people;
const movies = model.movies;
const reviews = model.reviews;
const nextReviewID = model.nextReviewID;

console.log("Testing functions");

//There should be 10 users. 5 of them should be contributing users
model.createUser({username:"Jola", password: "tears"});
model.changeAccountType("Jola");

model.createUser({username:"Dave", password: "joy"});
model.changeAccountType("Dave");

model.createUser({username:"Lelouch", password: "codegeass"});
model.changeAccountType("Lelouch");

model.createUser({username:"Light", password: "deathnote"});
model.changeAccountType("Light");

model.createUser({username:"Luffy", password: "onepiece"});
model.changeAccountType("Luffy");

model.createUser({username:"Ichigo", password: "bleach"});
model.createUser({username:"Naruto", password: "naruto"});
model.createUser({username:"Goku", password: "dbz"});
model.createUser({username:"Asta", password: "blackclover"});
model.createUser({username:"Midoriya", password: "mha"});
model.createUser({username:"notGonnaWork"});


//There should be 10 users, Ichigo is not a contributor.
model.addPerson(users["Jola"], {name:"Actor 1"});
model.addPerson(users["Jola"], {name:"Actor 2"});
model.addPerson(users["Jola"], {name:"Actor 3"});
model.addPerson(users["Jola"], {name:"Actor 4"});
model.addPerson(users["Jola"], {name:"Actor 5"});
model.addPerson(users["Jola"], {name:"Director 1"});
model.addPerson(users["Jola"], {name:"Director 2"});
model.addPerson(users["Jola"], {name:"Writer 1"});
model.addPerson(users["Jola"], {name:"Writer 2"});
model.addPerson(users["Jola"], {name:"Writer 3"});
model.addPerson(users["Ichigo"], {name:"Writer 4"});


//Testing Movie functions
model.addMovie("Jola", {title:"Movie 1", directors:["Director 1"], actors:["Actor 1", "Actor 1", "Actor 2"], writers:["Writer 1", "Writer 3"], genre:["Action","Action", "Adventure"], year:"2001", runtime:"80 min", plot:"Boring", rated:"G"});

model.addMovie("Jola", {title:"Movie 2", directors:["Director 2", "Actor 1"], actors:["Actor 2", "Actor 2", "Actor 3"], writers:["Writer 3","Writer 2"], genre:["Action","Drama", "Adventure"], year: "2001", runtime:"80 min", plot:"Boring", rated:"G"});

model.addMovie("Jola", {title:"Movie 3", directors:["Director 2"], actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1","Writer 3","Writer 2"], genre:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"});

model.addMovie("Jola", {title:"Movie 4", directors:["Director 1"], actors:["Actor 1", "Actor 3"], writers:["Writer 1","Writer 3"], genre:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"});

model.addDirector(users["Jola"], people["Actor 2"], "Movie 1");
model.addActor(users["Jola"], people["Director 2"], "Movie 4");
model.addWriter(users["Jola"], people["Actor 3"], "Movie 3");

//Testing model.writeReview()
model.writeReview({rating:10, movieTitle:"Movie 1", basic:true, reviewer:"Jola"});
model.writeReview({rating:8, movieTitle:"Movie 2", basic:false, reviewer:"Lelouch", summary:"Didn't like it", reviewText: "The truth is, I didn't like this movie"});
model.writeReview({rating:8, movieTitle:"Movie 2", basic:true, reviewer:"Jola"});
model.writeReview({rating:3, movieTitle:"Movie 4", basic:true, reviewer:"Lelouch"});
model.writeReview({rating:4, movieTitle:"Movie 3", basic:true, reviewer:"Lelouch"});

console.log(users["Jola"]);
console.log(users["Lelouch"]);
console.log(people["Actor 1"]);
console.log(movies);


console.log("model.addMovies() function passed!");

//Testing search functions
console.log("search results for 'Act' genre:",model.searchMoviesByGenre("Act"));
console.log("search results for 'Movie' title:",model.searchMoviesByTitle("Movie"));
console.log("search results for 'Movie 1' title:",model.searchMoviesByTitle("Movie 1"));
console.log("search results for '2001' year:", model.searchMoviesByYear("2001"));
console.log("search results for min rating of 8", model.searchMoviesByMinRating(8),"\n\n");

assert(model.isValidUser(users["Jola"]) == true, "Incorrect output for model.isValidUser()");
assert(model.isValidUser(users["Nobody"]) == false, "Incorrect output for model.isValidUser()");

assert(model.isValidPerson(people["Actor 1"]) == true, "Incorrect output for model.isValidPerson() test 1");
assert(model.isValidPerson(people["Nobody"]) == false, "Incorrect output for model.isValidPerson() test 2");

assert(model.isValidMovie(movies["Movie 1"]) == true, "Incorrect output for model.isValidMovie() test 1");
assert(model.isValidMovie(movies["Unlisted"]) == false, "Incorrect output for model.isValidMovie() test 2");

assert(model.isValidReview(reviews[0]) == true, "Incorrect output for model.isValidReview() test 1");
assert(model.isValidReview(reviews[5]) == false, "Incorrect output for model.isValidReview() test 2");

assert(model.getUser("Jola","Jola") == users["Jola"], "Incorrect user test 1");
assert(model.getUser("Jola","Nobody") == null, "Incorrect user test 2");

assert(model.getPerson("Actor 1") == people["Actor 1"], "Incorrect person test 1");
assert(model.getPerson("Nobody") == null, "Incorrect person test 2");

assert(model.getMovie("Movie 1") == movies["Movie 1"], "Incorrect movie test 1");
assert(model.getMovie("Unlisted") == null, "Incorrect movie test 2");

assert(model.getReview(0) == reviews[0], "Incorrect review test 1");
assert(model.getReview(5) == null, "Incorrect review test 2");

console.log("model.isValidUsers() function: Test passed!");
console.log("model.isValidPerson() function: Test passed!");
console.log("model.isValidMovie() function: Test passed!");
console.log("model.isValidReview() function: Test passed!");
console.log("model.getUsers() function: Test passed!");
console.log("model.getPerson() function: Test passed!");
console.log("model.getMovie() function: Test passed!");
console.log("model.getReview() function: Test passed!");





//Testing number of users
assert(Object.keys(users).length === 10, "Unexpected number of users");
console.log("model.createUsers() function: Test passed!");


//Testing number of contributors
assert(Object.keys(users).filter(key => users[key].contributor).length ===5, "Unexpected number of contributors");
console.log("model.changeAccountType() function: Test passed!");


//Testing number of people
assert(Object.keys(people).length === 10 && !people.hasOwnProperty("Writer 4"), "Unexpected number of people");
console.log("addPerson() function: Test passed!");


//Each user should have Jola as a follower
let jolaFollowing = []   //list to be used to test usersFollowing attribute of Jola


for(let user of Object.keys(users)){
    if(user === "Jola"){
        continue;
    }
    //Testing followUser() function
    model.followUser("Jola", user);
    assert(JSON.stringify(users[user].followers) === JSON.stringify(['Jola']), "Unexpected number of followers");

    //Testing followPerson() function
    model.followPerson(user, "Actor 1");
    assert(JSON.stringify(users[user].peopleFollowing === JSON.stringify(["Actor 1"])), "Unexpected number of people following");

    model.unfollowPerson(user, "Actor 1");
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
    //Testing model.unfollowUser function
    model.unfollowUser("Jola", user);

    //Testing followers attribute
    assert(users[user].followers.length == 0, "Unexpected number of followers");
}

console.log("model.unfollowUsers() function: Test passed!");






