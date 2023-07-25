import React, { useEffect, useState } from 'react'
import "./index.css"
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PaginatedLinks from '../../components/PaginatedLinks';


function People() {
    const [people, setPeople] = useState([]);
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [pageCount, setPageCount] = useState(1);
    const navigate = useNavigate();
  let genres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Short", "Sport", "Thriller", "War", "Western"]
  

  function generateRoleString(person){
    let returnStr = ""
    if(person.actor){
      returnStr += "Actor "
    }

    if(person.director){
      returnStr += "Director "
    }

    if(person.writer){
      returnStr += "Writer"
    }

    let returnStrList = returnStr.split(" ");

    if(returnStrList.length == 1){
      returnStr = returnStrList.join("");
    }

    else{
      if(!returnStrList[-1]){
        returnStrList.splice(-1);
      }
      returnStr = returnStrList.join(", ");
    }
    
    console.log(returnStr)
    return returnStr;
  }

  function generateMoviesString(movies){
    let returnStr = "";
    for(let i = 0; i < movies.length; i++){
      if(i == movies.length-1){
        returnStr += movies[i].title;
      }

      else{
        returnStr += movies[i].title + ", "
      }
      
    }
    
    return returnStr;
  }

  useEffect( () => {
    console.log("Pathname" + location.pathname + location.search);
      axios.get(location.pathname + location.search).then( res => {
          console.log(res.data);
          console.log("Last elem",res.data.slice(-1));
          setPageCount(res.data.splice(-1)[0].pageCount);
          setPeople(res.data);
      })


  },[location])

  if(!people){
    return null;
}


  return (
    <div className='people-container'>
        {people.length > 1?<div className='results-label'>Showing results for "{searchParams.get("name")}"</div>:
        <div className='results-label'>No results for "{searchParams.get("name")}"</div>}
        
        <div className='people-div'>
            {people.map( (person) =>(
                <div className='person-div'>

                    <div className="person-img">
                        <img src="/blankpfp.png"></img>
                    </div>

                    <div className='person-desc'>
                        <p className='person-name'>{<Link to={"/people/"+person.name}>{person.name}</Link>}</p>
                        <p className='person-roles'>{generateRoleString(person)}</p>
                        <p className='person-movies'>{person.movies.map( (movie, index) => {
                          if(index == person.movies.length-1){
                            return <Link to={"/movies/"+movie.title}>{movie.title}</Link>
                          }

                          else{
                            return <Link to={"/movies/"+movie.title}>{movie.title + ", "}</Link>
                          }
                        })}</p>
                    </div>

                </div>

            ))}
        </div>

        {location.search.includes("?") && pageCount > 1 && <PaginatedLinks url={location.pathname+location.search} pageCount={pageCount}/>}
    </div>

    
    
  )
}

export default People