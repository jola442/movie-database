const mongoose = require("mongoose");
const model = require("./businessLogic");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notificaiton = require("./NotificationModel");


let oldMovies = require("./movie-data-short.json");
const { db } = require("./MovieModel");
let movies = {};
let users = {};
let people = {};
let reviews = {};
let nextReviewID = 0;
let validRatings = ["PG-13", "PG", "R", "G", "Not Rated", "Unrated", "N/A", "TV-14", "TV-Y", "TV", "13+","14A",
 "16+", "18A", "18+", "R", "A", "TV-Y", "TV-G", "TV-Y7", "TV-Y7-FV", "TV-PG", "NC-17", "TV-MA"];

 let counter = 0;
//  for(movie of oldMovies){
     
//      let writers = movie.Writer.split(", ");    
//      let actors = movie.Actors.split(", ");
//      let directors = movie.Director.split(",");
 
//      //Remove whitespaces
//      writers = writers.map(writer => writer.trim());
//      actors = actors.map(actor => actor.trim());
//      directors = directors.map(director => director.trim());
 
//      //Ignore movies where movie personnel are listed as N/A
//      if(actors.includes("N/A")||directors.includes("N/A")||writers.includes("N/A")){
//          continue;
//      }
 
//      for(actor of actors){
//          addPerson(users["Jola"], {name:actor});
//      }
 
//      //Remove brackets from writer's name e.g Jack Black (screenplay by) becomes Jack Black
//      for(let i = 0; i < writers.length; i++){
//          let bracket = writers[i].indexOf("(");
//          if(bracket > 1){
//              writers[i] = writers[i].substring(0, writers[i].indexOf("(")).trim();
//          }
//          addPerson(users["Jola"], {name:writers[i]});
//      }
 
//      for(director of directors){
//          addPerson(users["Jola"], {name:director});
//      }
 
  
//      //Remove " mins" from the runtime so it can be converted to an integer
//      let processedRuntime = movie.Runtime.slice(0,-4);

//      newMovie = new Movie();
   
//      newPerson = new Person();

     

    //  if(addMovie("Jola", {title:movie.Title,
    //       directors:directors,
    //        actors:actors,
    //         writers:writers, 
    //         genres:movie.Genre.split(","),
    //          year: Number(movie.Year), 
    //          runtime:Number(processedRuntime),
    //           plot:String(movie.Plot),
    //            rated:String(movie.Rated), 
    //            poster:movie.Poster})){
    //                counter++;
    //            }
//  }

model.db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");
        
        jola = new User({username: "Jola", password: "tears"});
		dave = new User({username:})
        jola.save(function(err, result){
            if(err){
                console.log(err);
                return;
            }
            console.log("Added " + newUser.username);
        })




    

 



		
	// 	let completedProducts = 0;
	// 	productList.forEach(product => {
	// 		product.save(function(err,result){
	// 			if(err) throw err;
	// 			completedProducts++;
	// 			if(completedProducts >= productList.length){
	// 				console.log("All products saved.");
	// 			}
	// 		})
	// 	});
		
	// 	let completedUsers = 0;
	// 	userList.forEach(user => {
	// 		user.save(function(err,result){
	// 			if(err) throw err;
	// 			completedUsers++;
	// 			if(completedUsers >= userList.length){
	// 				console.log("All users saved.");
	// 			}
	// 		})
	// 	});
	});
});



