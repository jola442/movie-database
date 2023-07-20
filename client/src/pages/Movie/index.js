import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import "./index.css"
import {v4 as uuidv4} from "uuid";
import { FaStar } from 'react-icons/fa'

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
                            <li className='genres'>{movie.genres.map( (genre, index) => {
                                if(index == movie.genres.length-1){
                                    return genre;
                                }

                                else{
                                    return genre + ", "
                                }
                            })}</li>
                            <li className='runtime'>{movie.runtime}</li>
                        </ul>
                </div>
   
                <div className='movie-personnel'>
                    <p><b>Plot</b>: {movie.plot}</p>
                    <p><b>Actors: </b>{movie.actors.map( (actor, index) => {
                        if(index == movie.actors.length-1){
                            return <Link to={"/people/" + actor.name}><span>{actor.name}</span></Link>
                        }

                        else{
                            return <Link to={"/people/" + actor.name}><span>{actor.name + ", "}</span></Link>
                        }
                    })}</p>
                    <p><b>Writers: </b>{movie.writers.map( (writer, index) => {
                        if(index == movie.writers.length-1){
                            return <Link to={"/people/" + writer.name}><span>{writer.name}</span></Link>
                        }

                        else{
                            return <Link to={"/people/" + writer.name}><span>{writer.name + ", "}</span></Link>
                        }
                    })}</p>
                    <p className='directed'><b>Directed by:</b> <Link to={"/people/"+movie.director.name}>{movie.director.name}</Link></p>

                </div>

                {/* <div className="directed-wrapper">
                    <p className='directed'><b>Directed by:</b> <Link to={"/people/"+movie.director.name}>{movie.director.name}</Link></p>
                </div> */}
            </div>



        </div>

        <div className='movie-bottom-page'>
            {/* <div className="actors-slider">
                <p className='title'>Actors</p>
                <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={20}
                slidesPerView="auto"
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
                                    <div className='actor-image'>
                                        <img src="/blankpfp.png"/>
                                    </div>
                                   
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
                slidesPerView="auto"
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
                                    <div className='actor-image'>
                                        <img src="/blankpfp.png"/>
                                    </div>
                                   
                                    <p>{writer.name}</p>
                                </div>    
                            </Link>
                        </SwiperSlide> 
                    ))}
                   
                </Swiper>
            </div> */}

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
                                    <p className='movie-title'>{similarMovie.title}</p>
                                </div>   
                            </Link>
                        </SwiperSlide> 
                    ))}
                   
                </Swiper>
            </div>
            <br></br>
            <p className='title'>Reviews</p>
            <div className='movie-reviews'>
                <div className='movie-review'>
                    <div className='movie-review-left'>
                        <div className='movie-reviewer-image'>
                            <img src="/blankpfp.png"></img>
                        </div>  
                        <p>Name</p>

                    </div>
                    <div className='movie-review-right'>
                        <p className='movie-review-summary'><b>Review Summary</b></p>
                        <div className='movie-review-rating'>
                            <span>9.5</span>
                            <FaStar></FaStar>
                        </div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus, ipsum nec efficitur cursus, elit diam mattis ipsum, eget sagittis diam enim eget justo. Integer urna justo, scelerisque sed porttitor id, facilisis ut neque. Pellentesque dignissim efficitur suscipit. Sed quis libero eu lectus mollis lacinia non eget tellus. Nullam vitae mollis orci, sit amet maximus lacus. Pellentesque eu elit ut nulla posuere gravida. Suspendisse potenti. Sed suscipit nulla lectus, a laoreet dolor venenatis nec. Sed pulvinar orci et orci gravida sollicitudin. Proin pulvinar ante vel felis auctor feugiat. Maecenas tempus maximus malesuada. Nam sit amet tortor at diam tincidunt consectetur.
                    </div>
            
                </div>
            </div>
        </div>


    </>
  )
}

export default Movie