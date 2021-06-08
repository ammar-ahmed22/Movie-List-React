import React, {useState, useEffect} from 'react';
import testMovies from './testMovieList';


const MovieList = () => {
    
    return (
        <div className="movie-list">
            {
                testMovies.map((item, key) =>(
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
}

export default MovieList