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

const movie = "Space Jam";

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

console.log(movies.some(item => {
    return item.name == movie
}))

