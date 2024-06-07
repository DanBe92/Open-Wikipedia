

export default function articlePagesRouting(app) {

    // New Article
    app.get('/user/new_article', (req, res) => {
        res.render('pages/new_article');
    })

    // Read Article
    app.get('/user/read_article', (req, res) => {
        res.render('pages/read_article');
    })

    // Read Article
    app.get('/user/edit_article', (req, res) => {
        res.render('pages/edit_article');
    })

    app.post('/user/edit_article', (req, res) => {
        res.render('pages/edit_article');
    })

}