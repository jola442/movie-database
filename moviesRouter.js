const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");
const Movie = require("./MovieModel");
ENTRIES_PER_PAGE = 50;

router.get("/featured", respondWithFeaturedMovies)
router.get("/fanFavourites", respondWithFanFavourites)
router.get("/popular", respondWithPopularMovies)
router.get("/", [queryParser,respondWithMovies]);
router.get("/:title", respondWithMovie);


router.use(express.json());

router.post("/:title/actors", addNewActor);
router.post("/:title/writers", addNewWriter);
router.post("/:title/directors", changeDirector)
router.post("/", addNewMovie)
router.post("/:title/reviews", updateReviews);


async function respondWithFeaturedMovies(req, res){
    try{
        let results = await Movie.find( {genres: {$in:["Adventure"]}}).limit(50);
        res.status(200).json(results);
    }

    catch{
        console.log(err);
    }

    finally{
        return;
    }

}

async function respondWithFanFavourites(req, res){
    let results = await Movie.find( {genres: {$in:["Comedy"]}}).limit(50);
    res.status(200).json(results);
}

async function respondWithPopularMovies(req, res){
    let results = await Movie.find( {genres: {$in:["Romance"]}}).limit(50);
    console.log(results);
    res.status(200).json(results);
}


async function addNewMovie(req, res){
    const user = await model.getUser(req.session.username);
    try{
        if(!req.session.username || !(user.contributor)){
            res.status(401).send();
        }

        else if(model.addMovie(req.session.username, req.body)){
            res.status(201).send();
        }

        else{
            res.status(400).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

}


async function addNewActor(req, res){
    const user = await model.getUser(req.session.username);
    if(!req.session.username || !user.contributor){
        res.status(401).send();
    }

    
    else if(await model.addActor(req.session.username, req.body.name, req.body.title)){
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}

async function changeDirector(req, res){
    const user = await model.getUser(req.session.username);
    if(!req.session.username || !user.contributor){
        res.status(401).send();
    }

    else if(await model.changeDirector(req.session.username, req.body.name, req.body.title)){
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}

async function addNewWriter(req, res){
    const user = await model.getUser(req.session.username);
    if(!req.session.username || !user.contributor){
        res.status(401).send();
    }

    else if(await model.addWriter(req.session.username, req.body.name, req.body.title)){
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}


async function updateReviews(req, res){
    try{
        if(req.session.username){
            // req.body.reviewer = req.session.username;
            if(await model.addReview(req.session.username, req.body)){
                // res.redirect("/movies/"+req.body.movieTitle);
                res.status(200).send();
                // res.status(200).render("movie", {username:req.session.username, movie:model.movies[req.params.movieTitle], reviews:model.reviews});
            }
            else{
                res.status(400).send();
            }
        }
    
        else{
            res.status(401).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

    // next();
}

async function respondWithMovie(req, res){
    // console.log(req.params.title);
    try{

        reviews = await model.getReviews(req.params.title);
        averageRating = await model.getAverageRating(req.params.title);
        // console.log(averageRating);
        movie =  await Movie.findOne({title:req.params.title});
        // await model.updateSimilarMovies(movie);

        movie = await Movie.findOne({title:req.params.title}).lean()
        .populate({path:'actors', select:{"_id":0, "name":1}})
        .populate({path:'writers', select:{"_id":0, "name":1}})
        .populate({path:'director', select:{"_id":0, "name":1}})
        .populate({path:"similarMovies", select:{"_id":0, "title":1, "poster":1}}).exec();

        


       
        // console.log(movie);

        if(movie){
            movie.similarMovies = movie.similarMovies.splice(1,10)
            res.format({"text/html":
            function(){

                res.status(200).render("pages/movie", {reviews, username:req.session.username, movie: movie});
            },
        "application/json":
            function(){
                res.status(200).json(movie);
            }});

        }

        else{
            res.status(404).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

   
}

//This function parses the provided query string so that movies can be matched to it
function queryParser(req, res, next){

    const MAX_RATING = 10;
    const MIN_RATING = 0;
    if(!req.query.title){
        req.query.title = "";
    }

    if(!req.query.genre){
        req.query.genre = "";
    }

    if(!req.query.year){
        req.query.year = "";
    }

    else{
        try{
            req.query.year = Number(req.query.year);
        }

        catch{
            req.query.year = "";
        }
    }

    try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}


    if(req.query.minrating){
        try{
            req.query.minrating = Number(req.query.minrating);
            if(req.query.minrating > MAX_RATING){
                req.query.minrating = 10;
            }

            else if(req.query.minrating < MIN_RATING){
                req.query.minrating = 0;
            }
        }

        catch{
            req.query.minrating = undefined;
        }

    }

    next();

}

async function respondWithMovies(req, res){
    let movieQuery = Movie.find().lean()/*.skip((req.query.page-1)*ENTRIES_PER_PAGE);*/
    let pageCount = 0;

    // movieQueryString = "Movie.find()"
    for(parameter in req.query){
        if(req.query[parameter] === ""){
            movieQuery = movieQuery.where(parameter).ne(null);
        }

        else{
            if(parameter === "title"){
                movieQuery = movieQuery.byTitle(req.query[parameter]);
                // movieQueryString += ".where(" + parameter + ").includes(" + req.query[parameter] + ")"
            }

            else if(parameter === "genre"){
                movieQuery = movieQuery.byGenre(req.query[parameter]);
                // movieQueryString += ".where(" + parameter + ").includes(" + req.query[parameter] + ")"
            }

            else if(parameter === "year"){
                movieQuery = movieQuery.byYear(req.query[parameter]);
                // movieQueryString += ".where(" + parameter + ").includes(" + req.query[parameter] + ")"
            }

            else if(parameter === "minrating"){
                movieQuery = movieQuery.byMinRating(req.query[parameter]);
            }
            
        }
    }
 

    results = await movieQuery.select({"title":1, "poster":1, "_id":0}).exec();
    numResults = results.length;

    console.log("Results.length:", results.length);
    // if(results.length >= ENTRIES_PER_PAGE){
    //     results.push({pageCount:Math.floor(results.length/ENTRIES_PER_PAGE)});
    //     console.log(Math.floor(results.length/ENTRIES_PER_PAGE))
    //     queryObject["hasNext"] = true;
    // }

    // else{
    //     queryObject["hasNext"] = false;
    //     results.push({pageCount:1});
    // }
  
    // console.log(queryObject)

    if(results.length == 0){
        res.status(404).send();
    }

    else{
        if(numResults > ENTRIES_PER_PAGE){
            if(req.query.page >= 1){
                console.log("Page:" +req.query.page);
                console.log("Page type:", typeof(req.query.page));
                let pageCount = Math.floor(numResults/ENTRIES_PER_PAGE);
                console.log("Page Count:", pageCount);
                console.log("req.query.page-1", (req.query.page-1)*ENTRIES_PER_PAGE);
                results = results.slice((req.query.page-1)*ENTRIES_PER_PAGE, (req.query.page-1)*ENTRIES_PER_PAGE + ENTRIES_PER_PAGE);
                console.log("Results length", results.length);
                results.push({pageCount}) 
            }
    
        }

        else{
            results.push({pageCount:1})
        }
        // currentPage = Number(req.query.page);
        
 
        res.format(
            {
            "application/json": function(req, res){
                res.status(200).json(results);
            }
        })
    }
}



module.exports = router;