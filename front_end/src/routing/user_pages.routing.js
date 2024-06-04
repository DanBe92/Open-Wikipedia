

export default function userPagesRouting(app) {

    // User Dashboard
    app.get('/users/', (req, res) => {
        res.render('pages/user');
    })

    // User Library
    app.get('/users/library', (req, res) => {
        res.render('pages/library');
    })

}