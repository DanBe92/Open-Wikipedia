

export default function extraPagesRouting(app) {

    // About Us
    app.get('/about_us', (req, res) => {
        res.render('pages/about_us')
    });

    // Contact Us
    app.get('/contact_us', (req, res) => {
        res.render('pages/contact_us')
    });

    // Cookies
    app.get('/cookies', (req, res) => {
        res.render('pages/cookies')
    });

    // Privacy
    app.get('/privacy', (req, res) => {
        res.render('pages/privacy')
    });

    // Terms
    app.get('/terms', (req, res) => {
        res.render('pages/terms')
    });

}