import { ObjectId } from "mongodb";
import prisma from '../../db/prisma.js';
import { userValidation } from '../validations/users.validations.js';
import crypto from 'crypto';

export default function userRouting(app, db) {

    app.get("/users", (req, res) => {

        const page = req.query.page || 0;
        const usersPerPage = 2;

        let users = [];

        db.collection('user')
            .find()
            .sort({ lastName: 1 })
            .skip(page * usersPerPage)
            .limit(usersPerPage)
            .forEach(user => users.push(user))
            .then(() => {
                res.status(200).json(users);
            })
            .catch(() => {
                res.status(400).json({ error: 'Failed to fetch' })
            })
    });

    app.get("/users/:id", (req, res) => {

        if (ObjectId.isValid(req.params.id)) {
            const userId = new ObjectId(req.params.id);

            db.collection('user').findOne({ _id: userId })
                .then(user => {
                    res.status(200).json(user)
                })
                .catch(() => {
                    res.status(400).json({ error: 'Failed to fetch' })
                })

        } else {
            res.status(400).json({ error: 'Not a valid Id' })
        }

    });


    // Create New User
    app.post("/users", async (req, res) => {

        const user = await db.collection('user').findOne({ email: req.body.email })


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