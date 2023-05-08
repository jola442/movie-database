import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import "./index.css"
import {v4 as uuidv4} from "uuid";

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Movie() {
    const {title} = useParams();
    const [movie, setMovie] = useState(null);

    useEffect( () => {
        axios.get("/movies/" + title).then( res => {
            console.log(res.data);
            setMovie(res.data);
            window.scrollTo(0,0);
        }).catch( (error) =>{
            console.error(error.response.data);
        })
    },[title])

    if(!movie){
        return null;
    }

    

  return (
    <>
        <div className='movie-wrapper'>
            <div className='movie-img'>
                <img src={movie.poster}></img>
            </div>
            <div className='movie-info-wrapper'>
                <div className='movie-info-top'>
                    <p className='title'>{movie.title}</p>
                        <ul className='movie-facts'>
                            <li className='rated'>{movie.rated}</li>
                            <li className='year'>{movie.year}</li>
                            <li className='genres'>{movie.genres}</li>
                            <li className='runtime'>{movie.runtime}</li>
                        </ul>
                </div>
   
                <div className='plot'>
                    <p><b>Plot</b>:{movie.plot}</p>
                </div>

                <div className="directed-wrapper">
                    <p className='directed'><b>Directed by:</b> <Link to={"/people/"+movie.director.name}>{movie.director.name}</Link></p>
                </div>
            </div>



        </div>

        <div className='left-side'>
            <div className="actors-slider">
                <p className='title'>Actors</p>
                <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={20}
                slidesPerView={5}
                navigation
                //   pagination={{ clickable: true }}
                //   scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                >
                    {movie.actors.map( (actor) => (
                        <SwiperSlide>
                            <Link to={"/people/" +actor.name}>
                                <div className='actor' key={uuidv4()}>
                                    <img src="/blankpfp.png"/>
                                    <p>{actor.name}</p>
                                </div>   
                            </Link>
                 
                        </SwiperSlide> 
                    ))}
                   
                </Swiper>
            </div>

            <div className='writers-slider'>
            <p className='title'>Writers</p>
                <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={20}
                slidesPerView={5}
                navigation
                //   pagination={{ clickable: true }}
                //   scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                >
                    {movie.writers.map( (writer) => (
                        <SwiperSlide>
                            <Link to={"/people/" +writer.name}>
                                <div className='actor' key={uuidv4()}>
                                    <img src="/blankpfp.png"/>
                                    <p>{writer.name}</p>
                                </div>   
                            </Link>
                        </SwiperSlide> 
                    ))}
                   
                </Swiper>
            </div>

            <div className='similar-movies-slider'>
            <p className='title'>Similar Movies</p>
                <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={20}
                slidesPerView={5}
                navigation
                //   pagination={{ clickable: true }}
                //   scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                >
                    {movie.similarMovies.map( (similarMovie) => (
                        <SwiperSlide key={uuidv4()}>
                            <Link to={"/movies/"+ similarMovie.title}>
                                <div className='movie' key={uuidv4()}>
                                    <img src={similarMovie.poster}/>
                                    <p>{similarMovie.title}</p>
                                </div>   
                            </Link>
                        </SwiperSlide> 
                    ))}
                   
                </Swiper>
            </div>

        </div>

        <div className='right-side'>
            <h2>Reviews</h2>
            {/* <div className="reviews-wrapper">
                {movie.reviews.map( (review) => (
                    <div className='review' key={uuidv4()}>
                        <div className='profile-picture-wrapper'>
                            <img src="/blankpfp.png"/>
                        </div>

                        <div className='review-header'>
                            <p><b>{review.reviewer}</b></p>
                            <div className='rating'>
                                <p>{review.rating}</p>
                            </div>
                        </div>

                        <div className='review-text'>
                            <p>{review.reviewText}</p>
                        </div>
                    </div>
                ))}
            </div> */}

        </div>
    </>
  )
}

export default Movie