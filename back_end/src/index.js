import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import userRouting from './routing/user.routing.js'
import authRouting from './routing/auth.routing.js'
import searchRouting from './routing/search.routing.js'
import articleRouting from './routing/article.routing.js'


const app = express();

app.use(express.json({limit: '50mb'}));

app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(cors({
    origin: process.env.FRONT_END_PORT_URL3000
}));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/homepageCarousel', (req, res) => {
    res.send('FetchedCarouselHere');
});


userRouting(app);
authRouting(app);
searchRouting(app);
articleRouting(app);




app.listen(process.env.BACK_END_LISTEN_PORT, () => {
    console.log(`App Listening at Port ${process.env.BACK_END_LISTEN_PORT}`);
});
