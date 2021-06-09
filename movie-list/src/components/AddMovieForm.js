import React from 'react';


const AddMovieForm = ({setData}) =>{
    
    const handleClick = () =>{
        const input = document.getElementById('add-input');
        const parsedInput = input.value.split(' ').join('-');

        const addMovie = async () =>{
            const result = await fetch(`/api/movies/add/?movie=${parsedInput}&status=notWatched`);
            setData(result.json());
        }
        
        if (parsedInput !== ''){
            addMovie()
        }
        
        //console.log(input.value)
    }
    return (
        <div className="input-cont">
            <input type='text' className="movie-input" id="add-input"></input>
            <button onClick={handleClick} className="add-button">Add</button>
        </div>
        
    )
}

export default AddMovieForm;