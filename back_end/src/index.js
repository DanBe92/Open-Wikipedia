import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectToDb } from '../db/db.js';
import userRouting from './routing/user.routing.js'
import wiki from 'wikipedia';

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    origin: process.env.FRONT_END_PORT_URL3000
}));

connectToDb((db, err) => {
    if (!err) {
        app.listen(process.env.BACK_END_LISTEN_PORT, () => {
            console.log(`App listening on Port ${process.env.BACK_END_LISTEN_PORT}`);
        });
        userRouting(app, db);
    } else {
        console.log('Could not connect to db');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/testSummary', async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery;
        const page = await wiki.page(searchQuery);
        console.log(page);
        //Response of type @Page object
        const summary = await page.summary();
        console.log(summary);
        res.status(200).json(summary)
        //Response of type @wikiSummary - contains the intro and the main image

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Page Not Found" })
        //=> Typeof wikiError
    }
})

app.post('/testCompleteArticle', async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery ? req.body.searchQuery : req.body.suggestion;

        const searchResults = await wiki.search(searchQuery, {limit: 5});

        console.log(searchResults);

        res.status(200).json(searchResults)

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Page Not Found" })
        //=> Typeof wikiError
    }
})
