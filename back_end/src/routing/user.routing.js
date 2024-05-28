import { ObjectId } from "mongodb";
import prisma from '../../db/prisma.js';
import { userValidation } from '../validations/users.validations.js';
import crypto from 'crypto';
import isLoggedIn from '../middleware/isLoggedIn.js';

export default function userRouting(app, db) {

    app.get("/users", isLoggedIn, async (req, res) => {

        const users = await prisma.user.findMany()
        res.status(200).json(users);

    });

    app.get("/users/:id", isLoggedIn, async (req, res) => {

        const user = await prisma.user.findUnique({ where: { id: req.user.id } })
        res.status(200).json(user)

    });


    // Create New User
    app.post("/users", userValidation, async (req, res) => {

        const newUser = await prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: crypto.pbkdf2Sync(req.body.password, "salt", 10000, 100, "sha512").toString("hex")
            }
        })

        res.status(201)
        res.json(newUser)

    });


    // Delete User
    app.delete("/users/:id", (req, res) => {

        if (ObjectId.isValid(req.params.id)) {
            const userId = new ObjectId(req.params.id);

            db.collection('user')
                .deleteOne({ _id: userId })
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(() => {
                    res.status(400).json({ error: 'Failed to delete the user' })
                })

        } else {
            res.status(400).json({ error: 'Not a valid Id' })
        }
    });

    app.patch("/users/:id", (req, res) => {
        const updates = req.body;

        if (ObjectId.isValid(req.params.id)) {
            const userId = new ObjectId(req.params.id);

            db.collection('user')
                .updateOne({ _id: userId }, { $set: updates })
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(() => {
                    res.status(400).json({ error: 'Failed to update the user' })
                })

        } else {
            res.status(400).json({ error: 'Not a valid Id' })
        }
    });
}