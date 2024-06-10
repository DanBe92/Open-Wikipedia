import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import userRouting from './routing/user.routing.js'
import authRouting from './routing/auth.routing.js'
import searchRouting from './routing/search.routing.js'
import articleRouting from './routing/article.routing.js'
import isLoggedIn from './middleware/isLoggedIn.js';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';


const app = express();

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(cors({
    // origin: process.env.FRONT_END_PORT_URL3000
    origin: '*'
}));


// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });


// File Upload Endpoint
app.post('/upload', isLoggedIn, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = 'C:/Users/danie/Desktop/Scuola/GitHubRepository/Open-Wikipedia/back_end/uploads/' + req.file.originalname;
    const base64 = fs.readFileSync(file, 'base64');

    let body = new FormData()
    body.set('key', '01209f77c4b5065614c07ae2d7d78e73')
    body.append('image', base64)

    const urlAxios = 'https://api.imgbb.com/1/upload'

    const data = await axios({
        method: 'POST',
        url: urlAxios,
        data: body
      });

    const urlOutput = data.data.data.url;

    res.json({
        "success": 1,
        "file": {
            "url": urlOutput
        }
    });
});


// Routes
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
