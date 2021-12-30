//This function makes a GET request to the server with a query string generated through user input
function generateQueryString(){
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;
    let minrating = document.getElementById("minrating").value;
    let genre = document.getElementById("genre").value;
    let params = [];

    let queryString = "/movies?";
    if(title !== ""){
        // queryString += "title="+title;
        params.push("title="+title);
    }

    if(genre !== ""){
        // queryString += "&"+"genre="+genre;
        params.push("genre="+genre);
    }

    if(year !== ""){
        // queryString += "&"+"year="+year;
        params.push("year="+year);
    }

    if(minrating !== ""){
        // queryString += "&"+"minrating="+minrating;
        params.push("minrating="+minrating);
    }

    queryString += params.join("&");

    // console.log(queryString);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        window.location.href = queryString;
    }

    else if(this.readyState == 4 && this.status == 404){
        alert("No search results");
    }
    };
    xhttp.open("GET", queryString, true);
    xhttp.send();


}