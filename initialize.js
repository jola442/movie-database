const mc = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const model = require("./businessLogic");
const User = require("./UserModel");
const uri = "mongodb+srv://jola:naBEBmgvuZKQBXp0@moviedb.gcazrrx.mongodb.net/?retryWrites=true&w=majority";
// const Movie = require("./MovieModel");
// const Person = require("./PersonModel");
// const Review = require("./ReviewModel");
// const Notificaiton = require("./NotificationModel");


// MAX_MOVIES = 2;

let movies = require("./movie-data.json");
movieCount = 0;



intialUsers = [{username: "Jola", password: "tears"},
	{username: "Dave", password: "joy"},
	{username: "Lelouch", password: "codegeass"},
	{username: "Light", password: "deathnote"},
	{username: "Luffy", password: "onepiece"},
]

mongoose.connect(uri, {useNewUrlParser: true});
db = mongoose.connection;

db.on('connected', function() {
	console.log('database is connected successfully');
});
db.on('disconnected',function(){
	console.log('database is disconnected successfully');
})
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");

		main();
	})


})

async function main(){


	try{
			await initialize();
			await db.close();

	}
	
	catch(err){
		console.log(err);
	}
	
	finally{
		return;
	}
}

async function initialize(){
	try{
		await User.insertMany(intialUsers);

		accountTypeChanged = await model.changeAccountType("Jola");

		await addMovies();

		jolaFollowsDave = await model.followUser("Jola", "Dave");
		jolaFollowsLight = await model.followUser("Jola", "Light")

		daveFollowsLuffy = await model.followUser("Dave", "Luffy");
		daveFollowsJola = await model.followUser("Dave", "Jola");

		luffyFollowsDave = await model.followUser("Luffy", "Dave");
		luffyFollowsJola = await model.followUser("Luffy", "Jola");

		lightFollowsLelouch = await model.followUser("Light", "Lelouch");
		lightFollowsJola = await model.followUser("Light", "Jola");

		jolaFollowsTomHanks = await model.followPerson("Jola","Tom Hanks");
		jolaFollowsRobinWilliams = await model.followPerson("Jola", "Robin Williams");

		daveFollowsTimAllen = await model.followPerson("Dave","Tim Allen");
		daveFollowsDonRickles = await model.followPerson("Dave", "Don Rickles");



		await model.addReview("Jola", {rating:10, title:"Toy Story", basic:false, summary:"So good", reviewText: "Reminded me of when days were simpler and I didn't have to deal with all these deadlines"});
		await model.addReview("Dave", {rating:5, title:"Toy Story", basic:false, summary:"So good", reviewText: "Reminded me of when days were simpler and I didn't have to deal with all these deadlines"});
		await model.addReview("Light", {rating:9, title:"Toy Story", basic:false, summary:"So good", reviewText: "Reminded me of when days were simpler and I didn't have to deal with all these deadlines"});
		await model.addReview("Jola", {rating:4, title:"Jumanji",  basic:false, summary:"So bad", reviewText: "Almost broke my TV watching this"});
		await model.addReview("Dave", {rating:10, title:"Grumpier Old Men",  basic:false, summary:"Loved it", reviewText: "Good plot, good fight scenes"});
		await model.addReview("Dave", {rating:"2", title:"Waiting to Exhale", basic:false, summary:"Didn't like it", reviewText: "The truth is, I didn't like this movie"});
		// console.log(await model.getAverageRating("Toy Story"));
		// console.log(await model.getReviews("Toy Story"));
	
		// await model.addMovie("Jola", {collaborators: {"":0}, title:"Movie 1", director:"Director 1", actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1", "Writer 3", "Actor 1"], genres:["Action","Action", "Adventure"], year:"2001", runtime:"80 min", plot:"Boring", rated:"G"})
		// await model.addMovie("Jola", {title:"Movie 2", director:"Director 2", actors:["Actor 2", "Actor 2", "Actor 3"], writers:["Writer 3","Writer 2"], genres:["Action","Drama", "Adventure"], year: "2001", runtime:"80 min", plot:"Boring", rated:"G"})
		// await model.addMovie("Jola", {title:"Movie 3", director:"Director 2", actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1","Writer 3","Writer 2"], genres:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"})
		// await model.addMovie("Jola", {title:"Movie 4", director:"Director 2", actors:["Actor 1", "Actor 3"], writers:["Writer 1","Writer 3"], genres:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"});

		
	}
	
	catch{
		console.log(err.message);
	}

	finally{
		return;
	}

}

async function addMovies(){
	try{
		failedMovieCount = 0;
		for(movie of movies){
			
			// if(movieCount >= 10){
			// 	break;
			// }

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
		
			addedMovie = await model.addMovie("Jola", {title:movie.Title,
				 director: directors[0],
				  actors: actors,
				   writers: writers,
				    genres: movie.Genre.split(","),
					 year: Number(movie.Year),
					  runtime: movie.Runtime, plot: String(movie.Plot),
					rated: String(movie.Rated),
				poster: movie.Poster})
				

			if(addedMovie){
				++movieCount;
			}

			else{
				++failedMovieCount;
				console.log("Failed Movie Count:", failedMovieCount);
			}
			
		}
		console.log("There are", movieCount, "movies"); 
		// await model.addMovie("Jola", {collaborators: {"":0}, title:"Movie 1", director:"Director 1", actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1", "Writer 3", "Actor 1"], genres:["Action","Action", "Adventure"], year:"2001", runtime:"80 min", plot:"Boring", rated:"G"})
		// await model.addMovie("Jola", {title:"Movie 2", director:"Director 2", actors:["Actor 2", "Actor 2", "Actor 3"], writers:["Writer 3","Writer 2"], genres:["Action","Drama", "Adventure"], year: "2001", runtime:"80 min", plot:"Boring", rated:"G"})
		// await model.addMovie("Jola", {title:"Movie 3", director:"Director 2", actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1","Writer 3","Writer 2"], genres:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"})
		// await model.addMovie("Jola", {title:"Movie 4", director:"Director 2", actors:["Actor 1", "Actor 3"], writers:["Writer 1","Writer 3"], genres:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"});
	}

	catch(err){
		console.log(err.message);
	}

	finally{
		return;
	}
}





