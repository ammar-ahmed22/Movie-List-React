import express from 'express';
import bodyParse from 'body-parser';
import {MongoClient} from 'mongodb';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json())

//Function that is used for every database operation
const withDB = async (operations, res) =>{

    try{
        const client = await MongoClient.connect('mongodb://localhost/movie-list', { useNewUrlParser: true, useUnifiedTopology: true});

        const db = client.db('movie-list');

        await operations(db);
    } catch (error){
        res.status(500).json({message: 'Error connecting to DB', error});
    }
    

}

app.get('/hello', (req, res)=>{
    const {firstName, lastName} = req.query;


    try{
        if (firstName && lastName){
            res.status(200).json({
                "message": `hello ${firstName} ${lastName}`
            })
        }else if (firstName){
            res.status(200).json({
                "message": `hello ${firstName}`
            })
        }else{
            res.status(200).json({
                "message": "hello world!"
            })
        }
    }catch (error){
        res.status(400).json({
            "message": "something went wrong",
            error
        })
    }
    
});

//Gets all movies from MongoDB
app.get('/api/movies', async (req, res)=>{
    withDB(async (db)=>{
        const movies = await db.collection('movies').findOne({});

        res.status(200).json(movies)
    }, res)
})

//Updates movie status
app.get('/api/movie-status/', async (req, res)=>{
    const {movie, status} = req.query; //optional query paramteres, both required

    const parsedMovie = movie.split('-').join(' '); //parsing movie to space separated

    withDB(async (db) =>{
        const moviesObj = await db.collection('movies').findOne({});

        const movieExists = moviesObj.movies.some(item => {
            return item.name == parsedMovie;
        }) 

        if (movieExists){
            await db.collection('movies').updateOne({}, {
                '$set':{
                    movies: moviesObj.movies.map(item =>{
                        if (item.name == parsedMovie){
                            return {
                                "name": item.name,
                                "watched": (status == 'watched') ? true : false
                            }
                        }else{
                            return {
                                "name": item.name,
                                "watched": item.watched
                            }
                        }
                    })
                }
            })
    
            const updatedMoviesObj = await db.collection('movies').findOne({})
            res.status(200).json(updatedMoviesObj)
        }else{
            res.status(404).json({
                "error": `movie: '${parsedMovie}' does not exist`
            })
        }
        
    }, res)

    console.log(`movie: ${parsedMovie}, status: ${status}`);
})

// Add or remove movies from database
app.get('/api/movies/:operation', async (req, res)=>{
    const {movie, status} = req.query; //optional query parameters, status only required for adding
    const {operation} = req.params; //operation: add or remove

    const parsedMovie = movie.split('-').join(' '); //parsing movie to space separated


    withDB(async (db)=>{
        const moviesObj = await db.collection('movies').findOne({});

        const movieExists = moviesObj.movies.some(item => {
            return item.name == parsedMovie;
        }) 

        
        if (operation === 'add'){
            await db.collection('movies').updateOne({}, {
                '$set': {
                    movies: moviesObj.movies.concat(
                        {
                            "name": parsedMovie,
                            "watched": (status === 'watched') ? true : false
                        }
                    )
                }
            })

            const updatedMoviesObj = await db.collection('movies').findOne({});
            res.status(200).json(updatedMoviesObj)
        }else if (operation === 'remove' && movieExists){
            await db.collection('movies').updateOne({}, {
                '$set': {
                    movies: moviesObj.movies.filter(item =>{
                        return item.name !== parsedMovie
                    })
                }
            })

            const updatedMoviesObj = await db.collection('movies').findOne({});
            res.status(200).json(updatedMoviesObj);
        }else if (!movieExists && operation == 'remove'){
            res.status(404).json({
                "error":`movie: '${parsedMovie} does not exist; cannot be removed`
            })
        }else{
            res.status(400).json({
                "error": "something went wrong, check API call",
                "params": {
                    parsedMovie,
                    status,
                    operation
                }
            })
        }
    }, res)
})

const PORT = process.env.PORT || 2000;

app.listen(PORT, ()=>console.log(`listening on port ${PORT}`));