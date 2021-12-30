//This function adds event handlers to the plus buttons displayed on the page
// if the user is a contributing user
function init(){
    if(document.getElementById("add-director")){
        document.getElementById("add-director").addEventListener("click", addDirector);
        document.getElementById("add-writer").addEventListener("click", addWriter);
        document.getElementById("add-actor").addEventListener("click", addActor);
    }

}

//This function sends a POST request to /movies/movieName/reviews
function makeReview(){
    var xhttp = new XMLHttpRequest();
    let movieTitle = document.getElementById("title").lastChild.innerHTML;
    let rating = document.getElementById("rating").value;
    let reviewText = document.getElementById("review-text").value;
    let summary = document.getElementById("review-summary").value;
    let basic = false;

    if(rating.length == 0){
        alert("Unable to add review. Please specify a score");
        return;
    }

    if(summary.length < 1 && reviewText.length < 1){
        basic = true;
    }

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Successfully added review");
            window.location.href = "/movies/"+movieTitle;
       }

       else if(this.readyState ==4 && this.status == 400){
           alert("Unable to add review");
       }
    };
    let url = "/movies/" + movieTitle +"/reviews";
    let reviewObj = {rating:rating, movieTitle, basic};
    
    if(!basic){
        reviewObj.summary = summary;
        reviewObj.reviewText = reviewText;
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.send(JSON.stringify(reviewObj));
}

//This function makes a POST request to /movies/movieTitle/directors with information
//provided through user input
function addDirector(){
    let input = prompt("Enter a director name");
    let movieTitle = document.getElementById("title").lastChild.innerHTML;

    if(input != null){
        let data = {name:input, title:movieTitle};
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Director added successfully");
            window.location.reload();
        }

        else if(this.readyState == 4 && this.status == 400){
            alert("Unable to add director");
        }
        };
        xhttp.open("POST", "/movies/"+movieTitle+"/directors", true);
        xhttp.setRequestHeader("Content-type","application/json");
        xhttp.send(JSON.stringify(data));
    }
}

//This function makes a POST request to /movies/movieTitle/writers with information
//provided through user input
function addWriter(){
    let input = prompt("Enter a writer name");
    let movieTitle = document.getElementById("title").lastChild.innerHTML;

    if(input != null){
        let data = {name:input, title:movieTitle};
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Writer added successfully");
            window.location.reload();
        }
        else if(this.readyState == 4 && this.status == 400){
            alert("Unable to add writer");
        }
        };
        xhttp.open("POST", "/movies/"+movieTitle+"/writers", true);
        xhttp.setRequestHeader("Content-type","application/json");
        xhttp.send(JSON.stringify(data));
    }
}

//This function makes a POST request to /movies/movieTitle/actors with information
//provided through user input
function addActor(){
    let input = prompt("Enter an actor name");
    let movieTitle = document.getElementById("title").lastChild.innerHTML;
    

    if(input != null){
        let data = {name:input, title:movieTitle};
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Actor added successfully");
            window.location.reload();
        }

        else if(this.readyState == 4 && this.status == 400){
            alert("Unable to add actor");
        }
        };
        xhttp.open("POST", "/movies/"+movieTitle+"/actors", true);
        xhttp.setRequestHeader("Content-type","application/json");
        xhttp.send(JSON.stringify(data));
    }
}