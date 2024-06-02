

export default function articlePagesRouting(app) {

    // New Article
    app.get('/users/:id/new_article', (req, res) => {
        res.render('pages/new_article', { userId: req.params.id });
    })

   // Read Article
   app.get('/users/:id/read_article', (req, res) => {
    res.render('pages/read_article', { userId: req.params.id });
})

}