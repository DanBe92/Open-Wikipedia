import { ObjectId } from "mongodb";
import prisma from '../../db/prisma.js';
import { userValidation } from '../validations/users.validations.js';
import crypto from 'crypto';
import isLoggedIn from '../middleware/isLoggedIn.js';

export default function userRouting(app, db) {

    // Get Users
    app.get("/users", isLoggedIn, async (req, res) => {

        const users = await prisma.user.findMany()
        res.status(200).json(users);

    });


    // Get User By Id
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
    app.delete("/users/:id", isLoggedIn, async (req, res) => {

        const userId = req.params.id
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user) {
            const deleteUser = await prisma.user.delete({
                where: {
                    id: userId,
                },
            })

            res.json(user)

        } else {
            res.status(404).json({ message: 'User Not Found' })
        }
    })


    // Update User
    app.put('/users/:id', isLoggedIn, userValidation, async (req, res) => {

        const userId = req.params.id

        let user = await prisma.user.findUnique({ where: { id: userId } })

        if (user) {
            user = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    birthday: moment(req.body.birthday, 'YYYY-MM-DD').toISOString(),
                    email: req.body.email,
                    password: req.body.password,
                }
            });

            res.status(201)
            res.json(user)
        } else {
            res.status(404).json({ message: 'User Not Found' })
        }

        return

    });
}