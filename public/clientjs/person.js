//This function sends a PUT request to /people/personName/followers with a body 
//that indicates whether a person should be added or removed from a list of followers
function follow(){
    let xhttp = new XMLHttpRequest();
    let personName = document.getElementById("name").innerHTML;
    let action = {follow:true};

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            alert("Followed successfully");
            window.location.href = "/people/"+personName;
        }
    };
    
    xhttp.open("PUT", "/people/"+personName+"/followers", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(action));
}

//This function sends a PUT request to /people/personName/followers with a body 
//that indicates whether a person should be added or removed from a list of followers
function unfollow(){
    let xhttp = new XMLHttpRequest();
    let personName = document.getElementById("name").innerHTML;
    let action = {follow:false};

    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        alert("Unfollowed successfully");
        window.location.href = "/people/"+personName;
    }
    };
    xhttp.open("PUT", "/people/"+personName+"/followers", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(action));
}