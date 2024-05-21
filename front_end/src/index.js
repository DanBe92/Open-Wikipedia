import express from 'express';

const app = express();

app.use(express.static('public'));

app.set('view engine',  'ejs');

// Homepage
app.get('/homepage', (req, res) => {
    res.render('pages/homepage')
});

// Wiki-Search
app.get('/search', (req, res) => {
    res.render('pages/wiki-search')
});

app.listen(3000);