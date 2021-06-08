import React, {useState, useEffect} from 'react';
import testMovies from './testMovieList';


const MovieList = ({movies}) => {
    
    if (movies){
        return (
            <div className="movie-list">
                {
                    
                    movies.map((item, key) =>(
                        <div className="movie-cont" key={key}>
                            <input type="checkbox" className="movie-check" defaultChecked={item.watched} ></input>
                            <p className="unchecked"></p>
                            <p className="checked">✅</p>
                            <p className="movie-text" id={item.name.split(' ').join('-')} >
                                {item.name}
                            </p>
                        </div>
                    ))
                }
            </div>
        )
    }else{
        return (
            <div className="movie-list">
                <div className="movie-cont">
                            <input type="checkbox" className="movie-check" defaultChecked={false} ></input>
                            <p className="unchecked"></p>
                            <p className="checked">✅</p>
                            <p className="movie-text" id={`no-data`} >
                                NO DATA
                            </p>
                </div>
            </div>
        )
    }
    
}

export default MovieList