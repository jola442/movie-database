import { FaGithub, FaLinkedin, FaEnvelope, FaFilePdf } from "react-icons/fa"
import { Link } from "react-router-dom"
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


export default function Home(){
    const [movies, setMovies] = useState(null)

    // useEffect( () =>{
    //     fetch("/movies?&page=1").then( response => {console.log(response);
    //         response.json()}
    //         ).then(data =>{
    //         console.log(data);
    //     })
    //     }, [])


    useEffect( () => {
        axios.get("/movies?&page=1").then( res => {
            console.log(res.data);
            setMovies(res.data);
        })
    },[])

    if(!movies){
        return null;
    }
    let slides = []
    for(let i = 0; i < movies.length; ++i){
        slides.push({title: movies[i].title, url: movies[i].poster})
    }




    return (
        <>
        <h1>Featured Movies</h1>
        <div className="featured-movies">
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
                            <p>{movie.title}</p>
                        </Link>
                  
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        </>
        // <>
        //     <main>
        //         <article>
        //             <h1>Featured Movies</h1>
        //             <div className="featured-movies">
        //                 {movies.map( (movie) => (
        //                     <div className="featured-movie">
        //                         <div className="label">
        //                             <Link to={"/movies/"+movie.title}>
        //                                 {movie.title}
        //                             </Link>
        //                         </div>
        //                         <Link to={"/movies/"+movie.title}>
        //                                 {movie.poster?<>
        //                                 <img src={movie.poster}></img>
        //                                 </>:
        //                                 <img src="images/blankmovie.jpg" style={{width: "300px", height:"398px"}}/>
        //                                 }
        //                         </Link>
        //                     </div>))
        //                 }
        //             </div>

        //         </article>
        //     </main>
        // </>
      )
}