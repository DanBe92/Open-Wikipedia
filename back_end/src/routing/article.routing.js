import prisma from '../../db/prisma.js';
import { PrismaClient, Prisma } from '@prisma/client'
// import { userValidation } from '../validations/users.validations.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

export default function articleRouting(app, db) {

    // Check Single Article
    app.post('/checkArticle', isLoggedIn, async (req, res) => {
        try {
            const pageId = req.body.pageId;
            const userId = req.user.id;

            const article = await prisma.article.findUnique({
                where: {
                    pageIdUserId: {
                        pageId: pageId,
                        userId: userId
                    }
                }
            });

            if (article) {
                res.status(200).json({ 'isArticle': true })
                return
            }

            res.json({ 'isArticle': false })

        } catch (error) {
            console.log(error);
            res.json({ message: "Article Not Found" })
        }
    });

    // Get 9 User Articles A to Z
    app.post("/getUserArticles", isLoggedIn, async (req, res) => {

        try {
            const userId = req.user.id;
            const pagination = req.body.pagination;

            const articles = await prisma.article.findMany({
                where: {
                    userId: userId
                }
            })

            console.log(articles);

            if (articles.length > 0) {
                articles.forEach(article => {
                    delete article.id
                    delete article.userId
                });

                const sortedArticles = articles.sort(function (a, b) {
                    if (a.articleData.blocks[1].data.text < b.articleData.blocks[1].data.text) {
                        return -1;
                    }
                    if (a.articleData.blocks[1].data.text > b.articleData.blocks[1].data.text) {
                        return 1;
                    }
                    return 0;
                });

                let nineSortedArticles = [];

                let i = pagination;

                while (i < pagination + 9 && i < sortedArticles.length) {
                    nineSortedArticles.push(sortedArticles[i])
                    i++
                }

                res.status(200).json(nineSortedArticles);
                return
            }

            res.json({ message: 'No articles have been saved from this user' })

        } catch (error) {
            console.log(error);
            res.json({ message: "Articles Not Found" })
        }

    });

    // Get 10 Latest User Articles
    app.get("/getLatestUserArticles", isLoggedIn, async (req, res) => {

        const userId = req.user.id;

        const articles = await prisma.article.findMany({
            where: {
                userId: userId,
            },
        })

        if (articles.length > 0) {
            articles.forEach(article => {
                delete article.id
                delete article.userId
            })

            const sortedArticles = articles.sort((a, b) => {
                return b.articleData.time - a.articleData.time;
            })

            let tenSortedArticles = [];

            let i = 0

            while (i < 10 && i < sortedArticles.length) {
                tenSortedArticles.push(sortedArticles[i])
                i++
            }

            res.status(200).json(tenSortedArticles);
            return
        }

        res.json({ message: 'No articles have been saved from this user' })

    });


    // Create New Article
    app.post("/articles", isLoggedIn, async (req, res) => {

        try {

            const userId = req.user.id;
            const pageId = +req.body.pageId;

            // const newArticle = await prisma.article.create({
            //     data: {
            //         userId: userId,
            //         pageId: pageId,
            //         articleData: req.body.articleData
            //     }
            // });

            const newArticle = await prisma.article.upsert({
                where: {
                    pageIdUserId: {
                        pageId: pageId,
                        userId: userId
                    }
                },
                update: {
                    articleData: req.body.articleData
                },
                create: {
                    userId: userId,
                    pageId: pageId,
                    articleData: req.body.articleData
                }
            });

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


    // Update Article

    app.put("/updateArticle", isLoggedIn, async (req, res) => {

        const userId = req.user.id;
        const pageId = +req.body.pageId;

        const newArticle = await prisma.article.upsert({
            where: {
                pageIdUserId: {
                    pageId: pageId,
                    userId: userId
                }
            },
            update: {
                articleData: req.body.articleData
            },
            create: {
                userId: userId,
                pageId: pageId,
                articleData: req.body.articleData
            }
        });

        res.status(201).json(newArticle)

    });


    // Delete Article
    app.delete("/article", isLoggedIn, async (req, res) => {

        try {

            const userId = req.user.id
            const pageId = +req.body.pageId;

            const deletedArticle = await prisma.article.delete({
                where: {
                    pageIdUserId: {
                        pageId: pageId,
                        userId: userId
                    }
                }
            })

            res.json(deletedArticle)

        } catch (err) {

            console.log(err);
            res.status(404).json({ message: 'Article not Found' })

        }

    })

}