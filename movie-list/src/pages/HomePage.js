import React, {useState, useEffect} from 'react';
import MovieList from '../components/MovieList'
const HomePage = () =>{


    const [data, setData] = useState({data: []});

    useEffect(()=>{
        const fetchData = async () =>{
            const result = await fetch('/api/movies');
            const body = await result.json();

            setData(body);
        };

        fetchData()
    }, [data])

    console.log(data.movies)
    const movies = data.movies;

    return (
        <MovieList movies={movies} setData={setData}></MovieList>
    )
}

export default HomePage

