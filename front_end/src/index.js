import express from 'express';

const app = express();

app.use(express.static('public'));

app.set('view engine',  'ejs');


// Landing
app.get('/', (req, res) => {
    res.render('pages/landing_page')
});


// Homepage
app.get('/homepage', (req, res) => {
    res.render('pages/homepage')
});


// User Dashboard
app.get('/users/:id', (req, res) => {
    res.render('pages/user', {userId: req.params.id});
})

// User Library
app.get('/users/:id/library', (req, res) => {
    res.render('pages/library');
})


// Wiki-Search
app.get('/search', (req, res) => {
    res.render('pages/wiki-search')
});

app.listen(3000);