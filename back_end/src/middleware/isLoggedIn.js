import jwt from 'jsonwebtoken';

export default function isLoggedIn(req, res, next) {

    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {

        if (err) {
            return res.sendStatus(401);
        }

        req.user = user;
        next();
        
    })

   
}