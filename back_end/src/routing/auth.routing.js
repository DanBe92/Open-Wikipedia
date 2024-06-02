import prisma from "../../db/prisma.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


export default function authRouting(app) {

    app.post('/login', async (req, res) => {

        const user = await prisma.user.findFirst({
            where: {
                email: req.body.loginEmail,
                password: crypto.pbkdf2Sync(req.body.loginPassword, "salt", 10000, 100, "sha512").toString("hex")
            }
        });

        if (!user) {
            res.status(422).json({ loginEmail: [], loginPassword: ['Wrong Credentials'] } )
            return
        }

        const token = jwt.sign(user,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '1 hour'
            }
        );

        res.json({ 
            user,
            token
         })

    })

}