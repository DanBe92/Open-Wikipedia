import express from 'express';
import extraPagesRouting from './routing/extra_pages.routing.js';
import userPagesRouting from './routing/user_pages.routing.js';
import articlePagesRouting from './routing/article_pages.routing.js';

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


// Wiki-Search
app.get('/search', (req, res) => {
    res.render('pages/wiki-search')
});


extraPagesRouting(app);
userPagesRouting(app);
articlePagesRouting(app);

app.listen(3000);