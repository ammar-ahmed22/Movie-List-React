import express from 'express';
import bodyParse from 'body-parser';
import {MongoClient} from 'mongodb';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json())

//Function that is used for every database operation
const withDB = async (operations, res) =>{

    try{
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true});

        const db = client.db('movie-list');

        await operations(db);
    } catch (error){
        res.status(500).json({message: 'Error connecting to DB', error});
    }
    

}

app.get('/hello', (req, res)=>{
    res.status(200).json({
        "message":"hello world!"
    })
});

app.post('/api/add-movie', (req, res)=>{
    const movie = req.body.movie; //Getting movie

    withDB( async (db) =>{
        const moviesObj = await db.collection('movies').findOne({}); //movie collection before updating

        await db.collection('movies').updateOne({}, {
            '$set': {
                movies: moviesObj.movies.concat(movie)//Updating with movie added to the list
            }
        });

        const updatedMovies = await db.collection('movies').findOne({}); //Updated

        res.status(200).json(updatedMovies);
    }, res)
    console.table(movie)
})

app.post('/api/remove-movie', (req, res)=>{
    const movie = req.body.movie;

    withDB( async (db) =>{
        const moviesObj = await db.collection('movies').findOne({});
        
        
        await db.collection('movies').updateOne({}, {
            '$set':{
                movies: moviesObj.movies.filter(item =>{
                    return item.name !== movie;
                })
            }
        });

        const updatedMoviesObj = await db.collection('movies').findOne({});

        res.status(200).json(updatedMoviesObj);
    }, res)
})

app.post('/api/watch-movie', (req, res) =>{
    const movie = req.body.movie;

    withDB( async (db) =>{
        const moviesObj = await db.collection('movies').findOne({});

        await db.collection('movies').updateOne({}, {
            '$set':{
                movies: moviesObj.movies.map(item => {
                    if (item.name == movie){
                        return {
                            "name": item.name,
                            "watched": true,
                        }
                    }else{
                        return {
                            "name": item.name,
                            "watched": item.watched
                        }
                    }
                })
            }
        });
        const updatedMoviesObj = await db.collection('movies').findOne({});

        res.status(200).json(updatedMoviesObj);
    }, res)
})

const PORT = 1000;

app.listen(PORT, ()=>console.log(`listening on port ${PORT}`));