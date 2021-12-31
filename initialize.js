const mongoose = require("mongoose");
const model = require("./businessLogic");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notificaiton = require("./NotificationModel");
MAX_MOVIES = 2;

let movies = require("./movie-data-short.json");


intialUsers = [{username: "Jola", password: "tears"},
	{username: "Dave", password: "joy"},
	{username: "Lelouch", password: "codegeass"},
	{username: "Light", password: "deathnote"},
	{username: "Luffy", password: "onepiece"},
]


model.db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");

		User.insertMany(intialUsers, function(err, result){
			if(err){
				console.log(err);
			}

			model.changeAccountType("Jola", function(err){
				if(err){
					console.log(err);
				}

				movieCount = 0;
				for(movie of movies){
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

					//Remove brackets from writer's name e.g Jack Black (screenplay by) becomes Jack Black
					for(let i = 0; i < writers.length; i++){
						let bracket = writers[i].indexOf("(");
						if(bracket > 1){
							writers[i] = writers[i].substring(0, writers[i].indexOf("(")).trim();
						}
					}
				
					//Remove " mins" from the runtime so it can be converted to an integer
					let processedRuntime = movie.Runtime.slice(0,-4);

					
					model.addMovie("Jola", {title:movie.Title,
						director:directors[0],
						actors:actors,
							writers:writers, 
							genres:movie.Genre.split(","),
							year: Number(movie.Year), 
							runtime:Number(processedRuntime),
							plot:String(movie.Plot),
							rated:String(movie.Rated), 
							poster:movie.Poster})
								
							
				}

				// model.addPerson("Jola", {name: "Actor 1"}, function(err){
				// 	if(err){
				// 		console.log(err);
				// 	}
				
				// 	});

				});
		})
	});
});



