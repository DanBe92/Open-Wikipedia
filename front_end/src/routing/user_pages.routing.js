

export default function userPagesRouting(app) {

    // User Dashboard
    app.get('/user/', (req, res) => {
        res.render('pages/profile');
    })

    // User Library
    app.get('/user/library', (req, res) => {
        res.render('pages/library');
    })

}