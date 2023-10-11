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
        <div className="home-container">
            <div className="welcome-wrapper dark">
                <p className="label">Welcome</p>
                <p>All your favourite movies and people in one place! Explore now.</p>
            </div>
            <p className="label">Featured Movies</p>
            <div className="movies-slider light">
            <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                breakpoints={{
                    // when window width >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetweenSlides: 10
                    },
                    //when window width >= 520px
                    520: {
                        slidesPerView: 2,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 700px
                    700: {
                        slidesPerView: 3,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 1080px
                    1080: {
                        slidesPerView: 4,
                        spaceBetweenSlides: 10
                    },
                    // when window width is >= 1268px
                    1268: {
                        slidesPerView: 5,
                        spaceBetweenSlides: 10
                    } 
                }}
                navigation
                
                >
                    {featuredMovies.map( (movie) => (
                        <SwiperSlide key={uuidv4()}>
                            <Link to={"/movies/" + movie.title} className='movie' key={uuidv4()}>
            
                                <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                                <p className='movie-title'>{movie.title}</p>
                
                            </Link>
                    
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <p className="label dark">Fan Favourites</p>
            <div className="movies-slider dark">
            <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                breakpoints={{
                    // when window width >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetweenSlides: 10
                    },
                    //when window width >= 520px
                    520: {
                        slidesPerView: 2,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 700px
                    700: {
                        slidesPerView: 3,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 1080px
                    1080: {
                        slidesPerView: 4,
                        spaceBetweenSlides: 10
                    },
                    // when window width is >= 1268px
                    1268: {
                        slidesPerView: 5,
                        spaceBetweenSlides: 10
                    } 
                }}
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

            <p className="label light">What's Popular</p>
            <div className="movies-slider light">
            <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                breakpoints={{
                    // when window width >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetweenSlides: 10
                    },
                    //when window width >= 520px
                    520: {
                        slidesPerView: 2,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 700px
                    700: {
                        slidesPerView: 3,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 1080px
                    1080: {
                        slidesPerView: 4,
                        spaceBetweenSlides: 10
                    },
                    // when window width is >= 1268px
                    1268: {
                        slidesPerView: 5,
                        spaceBetweenSlides: 10
                    } 
                }}
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
        </div>
        </>

      )
}