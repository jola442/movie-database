document.getElementById("searchbar").addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        search();
    }
})


let username = document.getElementById("hiddenusername").innerHTML;

if(username){
    setInterval(function(){
        let xhttp = new XMLHttpRequest();
       
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let notifications = JSON.parse(this.responseText);
            // console.log(notifications)
            for(let i = 0; i < notifications.length; i++){
                alert(notifications[i]);
            }
        }
        };
        xhttp.open("PUT", "/users/"+username+"/notifications", true);
        xhttp.send();
    }, 5000);
}


//This function sends a DELETE request to the server to 'destroy' the current session
function signOut(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        // console.log("Logged out!");
    }
    };
    xhttp.open("DELETE", "/signOut", true);
    xhttp.send();
}

//This function sends a GET request to the server with a URL that depends on user input
function search(){
    let option = document.getElementById("search-options").value;
    let value = document.getElementById("searchbar").value;

    let body = "";
    if(option === "title"|| option === "genre" || option === "minrating" || option === "year"){
        body = "/movies?";
    }

    else if(option === "people"){
        body = "/people?";
        option = "name";
    }

    else if(option === "users"){
        body = "/users?";
        option = "name";
    }

    let url = body + option + "=" + value;
    // console.log(url);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        window.location.href = url;
    }

    else if(this.readyState == 4 && this.status == 404){
        // location.reload();
        alert("No search results");
    }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}