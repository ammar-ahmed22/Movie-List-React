import React, {useState, useEffect} from 'react';
import testMovies from './testMovieList';
import Loading from '../components/Loading';
import AddMovieForm from '../components/AddMovieForm';

const MovieList = ({movies, setData}) => {
    
    const refreshPage = () =>{
        window.location.reload();
    }

    const handleCheckClick = (e) =>{
        const updateMovie = async () =>{
            const result = await fetch(`/api/movie-status/?movie=${e.target.id}&status=${e.target.checked ? 'watched': 'notWatched'}`)
            setData(result.json())
        }

        updateMovie()
    }

    const handleRemoveClick = (e) =>{
        console.log(e.target.classList[2])
        const movie = e.target.classList[2];
        const removeMovie = async () =>{
            const result = await fetch(`/api/movies/remove/?movie=${movie}`);
            setData(result.json());
        }

        removeMovie();
    }

    if (movies){
        return (
            <div className="movie-list">
                {
                    
                    movies.map((item, key) =>(
                        <div className="movie-cont" key={key}>
                            <div className="movie-info-cont">
                                <input type="checkbox" className="movie-check" defaultChecked={item.watched} id={item.name.split(' ').join('-')} onClick={handleCheckClick}></input>
                                <p className="unchecked"></p>
                                <p className="checked">✅</p>
                                <p className="movie-text">
                                    {item.name}
                                </p>
                            </div>
                            
                            <div className="movie-remove-cont">
                                <p className={`remove-button`} onClick={handleRemoveClick}><i className={`bx bx-x ${item.name.split(' ').join('-')}`}></i></p>
                            </div>
                            
                        </div>
                    ))
                }
                <AddMovieForm setData={setData}></AddMovieForm>
                
            </div>
        )
    }else{
        return <Loading/>
    }
    
}

export default MovieList