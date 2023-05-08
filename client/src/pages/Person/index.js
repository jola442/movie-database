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

function Person() {
  const {name} = useParams();
  const [person, setPerson] = useState(null)

  useEffect( () => {
    axios.get("/people/" + name).then( res => {
        console.log(res.data);
        setPerson(res.data);
        window.scrollTo(0,0);
    }).catch( (error) =>{
        console.error(error.response.data);
    })
},[name])

if(!person){
    return null;
}

  return (
    <>
    <div className='person-wrapper'>
      <div className='person-img'>
        <img src="/blankpfp.png"></img>
        <div className='followers'>
          <p className='follower-count'><b>Followers: </b> {person.followers.length}</p>
          <button name='follow' className='follow'>Follow</button>
        </div>  
      </div>

      <div className='person-info-wrapper'>
          <p className='name'><b>{person.name}</b></p>
          <p className='appeared-in'>Appeared In ({person.movies.length})</p>

          <div className='movies-slider'>
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
                    {person.movies.map( (movie) => (
                        <SwiperSlide key={uuidv4()}>
                            <Link to={"/movies/"+ movie.title}>
                                <div className='movie' key={uuidv4()}>
                                    <img src={movie.poster}/>
                                    <p>{movie.title}</p>
                                </div>   
                            </Link>
                        </SwiperSlide> 
                    ))}
                   
              </Swiper>
          </div>
      </div>
    </div>



  
    
  <div className='collaborators-slider'>
  {/* <p className='title'>Most Frequent collaborators</p>
          <Swiper 
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={5}
          navigation
          //   pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
          >
              {person.collaborators.map( (actor) => (
                  <SwiperSlide>
                      <Link to={"/people/" +actor.name}>
                          <div className='actor' key={uuidv4()}>
                              <img src="/blankpfp.png"/>
                              <p>{actor.name}</p>
                          </div>   
                      </Link>
          
                  </SwiperSlide> 
              ))}
            
          </Swiper> */}
  </div>
    </>

  )
}

export default Person