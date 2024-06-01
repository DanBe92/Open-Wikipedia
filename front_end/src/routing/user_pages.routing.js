

export default function userPagesRouting(app) {

    // User Dashboard
    app.get('/users/:id', (req, res) => {
        res.render('pages/user', { userId: req.params.id });
    })

    // User Library
    app.get('/users/:id/library', (req, res) => {
        res.render('pages/library');
    })

}