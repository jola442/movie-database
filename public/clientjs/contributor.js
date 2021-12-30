//This function hides and shows elements of the contributor page depending on user input
function show(){
    let option = document.getElementById("contributor-options").value;
    let inputDiv = document.getElementsByClassName("input-fields");
    let personDiv = document.getElementById("person-input-fields");
    
    if(option == "movie"){
        document.getElementById("person-input-fields").style.display = "none";
        document.getElementById("movie-input-fields").style.display = "block";
        document.getElementById("autofill").style.display = "inline-block";
    }
  
    else{
        document.getElementById("person-input-fields").style.display = "block";
        document.getElementById("movie-input-fields").style.display = "none";
        document.getElementById("autofill").style.display = "none";

  
        for(let i = 0; i < personDiv.children.length; i++){
            if(personDiv.children[i].id !== option+"-field"){
                personDiv.children[i].style.display = "none";
            }

            else{
                personDiv.children[i].style.display = "block";
            }
        }
    }
}

//This function sends a POST request to the server with a URL and information that depend on user input
function add(){
    let option = document.getElementById("contributor-options").value;
    let data = {};
    let type = "";
    if(option === "actor"){
        let actorField = document.getElementById("actor-field");
        data.title = actorField.lastChild.previousSibling.value;
        data.name = actorField.lastChild.value;

        // actorField.firstChild.value = "";
        // actorField.lastChild.value = "";
        url = "/movies/"+data.title+"/actors";
    }

    else if(option === "director"){
        type = "director";
        let directorField = document.getElementById("director-field")
        data.title = directorField.lastChild.previousSibling.value;
        data.name = directorField.lastChild.value;

        // directorField.firstChild.value = "";
        // directorField.lastChild.value = "";

        url = "/movies/"+data.title+"/directors";
    }

    else if(option === "writer"){
        let writerField = document.getElementById("writer-field");
        data.title = writerField.lastChild.previousSibling.value;
        data.name = writerField.lastChild.value;

        // writerField.lastChild.value = "";
        // writerField.firstChild.value = "";

        url = "/movies/"+data.title+"/writers";
    }

    else if(option === "person"){
        let personField = document.getElementById("person-field");
        data.name = personField.lastChild.value;
        // console.log(data.name);
        // personField.firstChild.value = "";
        url = "/people";
    }

    else if(option === "movie"){
        data.title = document.getElementById("title-text").value;
        // console.log(data.title);
        data.year = document.getElementById("year-text").value;
        // console.log(data.year);
        data.rated = document.getElementById("rated-text").value;

        data.runtime = document.getElementById("runtime-text").value;

        data.genres = document.getElementById("genre-text").value;
        data.genres = data.genres.split(",");
        data.genres = data.genres.map(ele => ele.trim());
        // console.log(data.genres);

        data.directors = document.getElementById("director-text").value;
        data.directors = data.directors.split(",");
        data.directors = data.directors.map(ele => ele.trim());
        // console.log(data.directors);

        data.actors = document.getElementById("actor-text").value;
        data.actors = data.actors.split(",");
        data.actors = data.actors.map(ele => ele.trim());
        // console.log(data.actors);

        data.writers = document.getElementById("writer-text").value;
        data.writers = data.writers.split(",");
        data.writers = data.writers.map(ele => ele.trim());

        data.plot = document.getElementById("plot-text").value;
        // console.log(data.writers);

        url = "/movies";
        let trophies = ["Premier League", "FA Cup", "Champions League", "Europa League", "League Cup"];

        let titleList = data.title.split(" ");
    
        if(titleList.length > 2){
            let trophy = titleList[titleList.length-2] + " " + titleList[titleList.length-1];
            // console.log(titleList);
            // console.log(trophy);
            if(trophies.includes(trophy)){
                data.poster = "../../Images/"+trophy+".jpg";
            }
        }
    }




    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201||this.status == 200)){
            // window.location.href = "/contributor-options";
            alert("Sucessfully added.");
        }
        else if(this.readyState == 4 && this.status == 401){
            alert("You are not authorized to do this");
        }

        else if(this.readyState == 4 && this.status == 400){
            if(option == "movie") alert("Unable to add movie");
            else if(option === "person") alert("This person is already in the database");
            else if(option === "actor") alert("Unable to add this actor");
            else if(option === "director") alert("Unable to add this director");
            else if(option === "writer") alert("Unable to add this writer");
        }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type","application/json");
        xhttp.send(JSON.stringify(data));
}

//This function fills textboxes of the contributor-options page with randomized information
function autofill(){
    let firstNames = ["Christian", "Timo", "Tammy", "Mason", "Hakim", "Kai", "Ben", "Ngolo", "Edouard", "Reece", "Caesar", "Kurt", "Thiago", "Mateo"];
    let lastNames = ["Pulisic", "Werner", "Abraham", "Mount", "Ziyech", "Havertz", "Chilwell", "Kante", "Mendy", "James", "Azplicueta", "Zouma", "Silva", "Kovacic"];
    let genres = ["Action", "Adventure", "Drama", "Fantasy", "Thriller", "Comedy", "Sports"];
    let team = "Chelsea";
    let trophies = ["Premier League", "FA Cup", "Champions League", "Europa League", "League Cup"];


    let randomTrophy = trophies[Math.floor(Math.random()*trophies.length)];
    let randomTitle = team + " wins the "+ randomTrophy;

    let randomYear = Math.floor(Math.random()*(2021-2000))+2000;        //random year from 2000 to 2020
    let randomRuntime = Math.floor(Math.random()*(201-60))+60;           //random runtime from 60 to 201 
    let ratings = ["PG-13", "PG", "R", "G", "Not Rated", "Unrated", "N/A", "TV-14", "TV-Y", "TV", "13+","14A",
 "16+", "18A", "18+", "R", "A", "TV-Y", "TV-G", "TV-Y7", "TV-Y7-FV", "TV-PG", "NC-17", "TV-MA"];

    let randomFirstName = firstNames[Math.floor(Math.random()*firstNames.length)];
    let randomLastName = lastNames[Math.floor(Math.random()*lastNames.length)];
    let randomActors = "";
    let randomDirector = randomFirstName + " " + randomLastName;
    let randomWriters = "";
    let randomGenres = "";
    let randomPlot = "This is the story of how " + team + " won the " + randomTrophy; 
    let randomRating = ratings[Math.floor(Math.random()*ratings.length)];

    for(let i = 0; i < 5; i++){
        let writerFirstName = firstNames[Math.floor(Math.random()*firstNames.length)];   
        let writerLastName = lastNames[Math.floor(Math.random()*lastNames.length)];

        let actorFirstName = firstNames[Math.floor(Math.random()*firstNames.length)]; 
        let actorLastName = lastNames[Math.floor(Math.random()*lastNames.length)];
        
        let randomGenre = genres[Math.floor(Math.random()*genres.length)];

        if(!randomWriters.includes(writerFirstName + " " + writerLastName + ", "));
            randomWriters += writerFirstName + " " + writerLastName + ", ";
        
        if(!randomActors.includes(actorFirstName + " " + actorLastName + ", "))
            randomActors += actorFirstName + " " + actorLastName + ", ";

        if(!randomGenres.includes(randomGenre))
            randomGenres += randomGenre + ", ";
    }

    randomActors = randomActors.slice(0, -2);
    randomWriters = randomWriters.slice(0, -2);
    randomGenres = randomGenres.slice(0, -2);

    let labels = ["title", "year", "rated", "runtime", "genre", "director", "actor", "writer", "plot"];
    let values = [randomTitle, randomYear, randomRating, randomRuntime, randomGenres, randomDirector, randomActors, randomWriters, randomPlot];

    for(i = 0; i < labels.length; i++){
        document.getElementById(labels[i]+"-"+"text").value = values[i];
    }

}

