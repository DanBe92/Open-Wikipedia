import express from 'express';
import { connectToDb } from '../db/db.js';
import userRouting from './routing/user.routing.js'

const app = express();
app.use(express.json());

connectToDb((db, err) => {
    if (!err) {
        app.listen(8000, () => {
            console.log('App listening on Port 8000');
        });
        userRouting(app, db);
    } else {
        console.log('Could not connect to db');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});
