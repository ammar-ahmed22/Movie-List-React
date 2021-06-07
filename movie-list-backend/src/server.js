import express from 'express';
import bodyParse from 'body-parser';
import {MongoClient} from 'mongodb';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json())

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
                toWatch: moviesObj.toWatch.concat(movie)//Updating with movie added to the list
            }
        });

        const updatedMovies = await db.collection('movies').findOne({}); //Updated

        res.status(200).json(updatedMovies);
    }, res)
    console.log(movie)
})

app.listen(2000, ()=>console.log("listening on port 2000"));