import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import "./index.css"
import MobileNavbar from "../../components/MobileNavbar";
import { useState, useEffect } from "react";
import axios from "axios"
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import {v4 as uuidv4} from "uuid";
import PaginatedLinks from "../../components/PaginatedLinks";



function Movies() {
  const [movies, setMovies] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [pageCount, setPageCount] = useState(1);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
let genres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Short", "Sport", "Thriller", "War", "Western"]

function search(){
  let title = inputs.title || "";
  let year = inputs.year || "";
  let minRating = inputs.minRating || "";
  let genre = inputs.genre  || "";
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

  if(minRating !== ""){
      // queryString += "&"+"minRating="+minRating;
      params.push("minRating="+minRating);
  }

  queryString += params.join("&");
  console.log(queryString)

  navigate(queryString);
  setInputs({})
}

function handleChange(event){
  let name = event.target.name;
  let value = event.target.value;
  setInputs(values => ({...values, [name]:value}));
}


useEffect( () => {
  console.log("Pathname" + location.pathname + location.search);
    axios.get(location.pathname + location.search).then( res => {
        console.log(res.data);
        console.log("Last elem",res.data.slice(-1));
        setPageCount(res.data.splice(-1)[0].pageCount);
        setMovies(res.data);
    })
},[location])


// useEffect( () => {console.log(movies)}, [movies])

if(!movies){
    return null;
}


  return (
    <>
    {/* <div>Movies</div> */}
    <div className='movies-container'>
      <div className='movies-left'>
        <div className="filter-box">
          <p className="filters">Filters</p>

          <div className='year filter-wrapper'>
            <span><b>Year:</b></span>
            <input type="textbox" name="year" value={inputs.year||""} onChange={handleChange}></input>
          </div>

          <div className='genre filter-wrapper'>
            <span><b>Genre:</b></span>
            <input type="textbox" name="genre" value={inputs.genre||""} onChange={handleChange}></input>
          </div>

          <div className='min-rating filter-wrapper'>
            <span><b>Minimum Rating:</b></span>
            <input type="textbox" name="minRating" value={inputs.minRating||""} onChange={handleChange}></input>
          </div>

          <div className='filter-wrapper'>
            <span><b>Title:</b></span>
            <input type="textbox" name="title" value={inputs.title||""} onChange={handleChange}></input>
          </div>   
        </div>
      

        <div className='movies-search-button'>
          <button onClick={search}>Search</button>
        </div>
      </div>

      <div className='movies-right'>
        {movies.length <= 1?<p className="results-label">No Results</p>:
        movies.map( (movie) => (
            <Link to={"/movies/"+ movie.title} key={uuidv4()}>
                <div className='movie'>
                    <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                    <p className='movie-title'>{movie.title}</p>
                </div>   
            </Link>
        ))
        }


        {/* {pageCount > 1 && <div className="pages-container">{pageNumbers.map( (pageNumber,index) => {
          if(index != pageNumbers.length-2){
            return <Link to={generatePageLink(pageNumber)} className="page-number">{pageNumber}</Link>
          }

          else{
            return <div>...</div>
          }
  
        })}</div>} */}
        
      </div>

        {/* {hasNext?<Link to={location.pathname+location.search+"page"}> */}

        {/* <Link/>} */}
    </div>
   
    {location.search.includes("?") && pageCount > 1 && <PaginatedLinks url={location.pathname+location.search} pageCount={pageCount}/>}
    </>
  )
}

export default Movies