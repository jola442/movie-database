import { Link } from "react-router-dom"
import "./index.css"
import { useState, useEffect, useContext } from "react";
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
import MobileNavbar from "../../components/MobileNavbar";



export default function Home(){
    const [featuredMovies, setFeaturedMovies] = useState(null)
    const [popularMovies, setPopularMovies] = useState(null)
    const [fanFavourites, setFanFavourites] = useState(null)

    useEffect( () => {
        axios.get("movies/featured").then( res => {setFeaturedMovies(res.data);})
        .then(axios.get("movies/fanFavourites").then(res => {setFanFavourites(res.data)}))
        .then(axios.get("movies/popular").then(res => {setPopularMovies(res.data)}))
    },[])

    if(!featuredMovies || !popularMovies || !fanFavourites){
        return null;
    }
  
    return (
        <>
        <MobileNavbar></MobileNavbar>
        <div className="welcome-wrapper home-dark">
            <p className="home-label">Welcome</p>
            <p>Millions of movies, TV shows and people to discover. Explore now.</p>
        </div>
        <p className="home-label">Featured Movies</p>
        <div className="home-movies-slider home-light">
            <Swiper 
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={5}
            navigation
            >
                {featuredMovies.map( (movie) => (
                    <SwiperSlide key={uuidv4()}>
                        <Link to={"/movies/" + movie.title}>
                            <div className='movie' key={uuidv4()}>
                                <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                                <p className='movie-title'>{movie.title}</p>
                            </div>   
                        </Link>
                  
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        <p className="home-label home-dark">Fan Favourites</p>
        <div className="home-movies-slider home-dark">
            <Swiper 
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={5}
            navigation
            >
                {fanFavourites.map( (movie) => (
                    <SwiperSlide key={uuidv4()}>
                       <Link to={"/movies/" + movie.title}>
                            <div className='movie' key={uuidv4()}>
                                <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                                <p className='movie-title'>{movie.title}</p>
                            </div>   
                        </Link>
                  
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        <p className="home-label home-light">What's Popular</p>
        <div className="home-movies-slider home-light">
            <Swiper 
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={5}
            navigation
            >
                {popularMovies.map( (movie) => (
                    <SwiperSlide key={uuidv4()}>
                       <Link to={"/movies/" + movie.title}>
                            <div className='movie' key={uuidv4()}>
                                <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                                <p className='movie-title'>{movie.title}</p>
                            </div>   
                        </Link>
                  
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
        </>

      )
}