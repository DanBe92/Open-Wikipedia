import prisma from '../../db/prisma.js';
import { PrismaClient, Prisma } from '@prisma/client'
// import { userValidation } from '../validations/users.validations.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

export default function articleRouting(app, db) {

    // Get Articles
    app.get("/getUserArticles", isLoggedIn, async (req, res) => {

        const userId = req.user.id;

        const articles = await prisma.article.findMany({
            where: {
                userId: userId
            }
        })

        if (articles.length > 0) {
            articles.forEach( article => {
                delete article.id
                delete article.userId
            })
            res.status(200).json(articles);
            return
        }

        res.status(404).json({ message: 'No articles saved from this user' })


    });


    // Create New Article
    app.post("/articles", isLoggedIn, async (req, res) => {

        try {
            const userId = req.user.id;
            const pageId = +req.body.pageId;

            const newArticle = await prisma.article.create({
                data: {
                    userId: userId,
                    pageId: pageId,
                    articleData: req.body.articleData
                }
            })

            res.status(201).json(newArticle)

            return

        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    res.status(400).json({ message: "This Article is already saved in your library" })
                    return
                }
            }
            res.status(400).json({ message: "Couldn't save the article" })

            return
        }
    });


    //     // Delete Article
    //     app.delete("/users/:id", isLoggedIn, async (req, res) => {

    //         const userId = req.params.id
    //         const user = await prisma.user.findUnique({ where: { id: userId } });

    //         if (user) {
    //             const deleteUser = await prisma.user.delete({
    //                 where: {
    //                     id: userId,
    //                 },
    //             })

    //             res.json(user)

    //         } else {
    //             res.status(404).json({ message: 'User Not Found' })
    //         }
    //     })



    // Update Article next


}