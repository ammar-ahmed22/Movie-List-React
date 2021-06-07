const movies = [
    {
        "name": "Interstellar",
        "watched": false
    }, 
    {
        "name": "Inception",
        "watched": true
    }
]

const movie = "Interstellar";

const updatedMovies = movies.map(item =>{
    if (item.name == movie){
        return {
            "name": item.name,
            "watched": true
        }
    }else{
        return{
            "name": item.name,
            "watched": item.watched
        }
    }
})

console.log(updatedMovies);