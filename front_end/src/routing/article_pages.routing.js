

export default function articlePagesRouting(app) {

    // New Article
    app.get('/users/new_article', (req, res) => {
        res.render('pages/new_article');
    })

    // Read Article
    app.get('/users/read_article', (req, res) => {
        res.render('pages/read_article');
    })

    // Read Article
    app.get('/users/edit_article', (req, res) => {
        res.render('pages/edit_article');
    })

}