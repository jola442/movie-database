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



export default function Home(){
    const [movies, setMovies] = useState(null)
    let fakeUsers = ["Luffy", "Lelouch", "Dave", "Dave", "Dave", "Dave", "Dave"]

    useEffect( () => {
        axios.get("/movies?&page=1").then( res => {
            console.log(res.data);
            setMovies(res.data);
        })
    },[])

    if(!movies){
        return null;
    }
  
    return (
        <>
        <div className="welcome-wrapper home-dark">
            <p className="home-label">Welcome</p>
            <p>Millions of movies, TV shows and people to discover. Explore now.</p>
        </div>
        <p className="home-label">Featured Movies</p>
        <div className="home-movies-slider home-light">
            <Swiper 
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={5}
            navigation
            //   pagination={{ clickable: true }}
            //   scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            >
                {movies.map( (movie) => (
                    <SwiperSlide key={uuidv4()}>
                        <Link to={"/movies/" + movie.title}>
                            <img src={movie.poster}></img>
                            <p className="movie-title">{movie.title}</p>
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
            spaceBetween={50}
            slidesPerView={5}
            navigation
            //   pagination={{ clickable: true }}
            //   scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            >
                {movies.map( (movie) => (
                    <SwiperSlide key={uuidv4()}>
                        <Link to={"/movies/" + movie.title}>
                            <img src={movie.poster}></img>
                            <p className="movie-title">{movie.title}</p>
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
            spaceBetween={50}
            slidesPerView={5}
            navigation
            //   pagination={{ clickable: true }}
            //   scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            >
                {movies.map( (movie) => (
                    <SwiperSlide key={uuidv4()}>
                        <Link to={"/movies/" + movie.title}>
                            <img src={movie.poster}></img>
                            <p className="movie-title">{movie.title}</p>
                        </Link>
                  
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        {/* <div className='home-people-slider'>
    <p className='home-label'>Most Followed Celebrities</p>
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
          {fakeUsers.map( (collaborator) => (
              <SwiperSlide key={uuidv4()}>
                  <Link to={"/users/"+ collaborator}>
                      <div className='home-person' key={uuidv4()}>
                          <div className='home-person-image'>
                            <img src="/blankpfp.png"/>
                            <p>{collaborator}</p>
                          </div>
                          
                          
                      </div>   
                  </Link>
              </SwiperSlide> 
          ))}
      
  </Swiper>
  </div>  */}

        </>

      )
}