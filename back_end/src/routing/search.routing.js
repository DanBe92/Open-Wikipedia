import wiki from 'wikipedia';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import isLoggedIn from '../middleware/isLoggedIn.js';
import prisma from '../../db/prisma.js';

export default function searchRouting(app) {

    // First step when searching an article
    // Response is a list of possible pages
    app.post('/firstSearch', isLoggedIn, async (req, res) => {
        try {
            const searchQuery = req.body.firstSearch ? req.body.firstSearch : req.body.suggestion;

            if (searchQuery !== undefined) {

                // const language = await wiki.setLang('it');
                const searchResults = await wiki.search(searchQuery, { suggestion: true, limit: 5 })

                const resultIds = searchResults.results.map(result => {
                    return { 'title': result.title, 'pageId': result.pageid };
                });

                res.status(200).json(resultIds)
                return
            }

            res.status(404).json({ message: "Page Not Found" })

        } catch (error) {
            console.log("Error:", error);
            res.status(404).json({ message: "Page Not Found" })
        }
    });


    // Second step
    // Response is the url of the selected article
    app.post('/getPageUrl', isLoggedIn, async (req, res) => {
        try {
            let isArticle;
            const pageId = req.body.pageId;
            const userId = req.user.id;
            // const language = await wiki.setLang('it');

            const page = await wiki.page(pageId);

            const article = await prisma.article.findUnique({ 
                where: {
                    pageIdUserId: {
                        pageId: pageId,
                        userId: userId
                    }
                }
            })

            if (article) {
                isArticle = true
            }

            res.status(200).json({ 'isArticle': isArticle, 'articleUrl': page.fullurl })

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Page Not Found" })
        }
    });


    // Third step
    // Response is full article with all data in it
    app.post('/getFullArticle', isLoggedIn, async (req, res) => {
        try {

            const url = req.body.articleUrl
            const limit = req.body.limit

            const data = await axios.get(url);

            const dom = new JSDOM(data.data);

            const domTitle = dom.window.document.querySelector('#firstHeading').textContent;
            let paragraphs = [];
            let urlImage;
            let baseUrlImage;

            const page = await wiki.page(domTitle);

            dom.window.document.querySelectorAll('#mw-content-text p').forEach((p, index) => {

                if (index >= limit) {
                    return
                }
 
                const paragraph = p.textContent.replace(/\[(.+?)\]/g, "")

                if (paragraph !== '\n') {
                    paragraphs.push(paragraph)
                }

                urlImage = dom.window.document.querySelector('.mw-file-description img')?.src;
                baseUrlImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png"

            });

            res.json({
                'title': domTitle,
                'paragraphs': paragraphs,
                'urlImage': urlImage ? "https:" + urlImage : baseUrlImage,
                'pageId': page.pageid
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            res.status(404).json({ message: "Article not Found" })
        }
    })


    // Gets the Daily Article
    app.get('/dailyArticlePreview', isLoggedIn, async (req, res) => {
        try {

            // const language = await wiki.setLang('it');

            const data = await axios.get('https://en.wikipedia.org/wiki/Main_Page');

            const dom = new JSDOM(data.data);

            const imgCaption = dom.window.document.querySelector('#mp-tfa-img .thumbcaption')?.textContent;
            const tfaTitle = dom.window.document.querySelector('#mp-tfa b:last-child a')?.title;
            const tfaUrlImage = dom.window.document.querySelector('#mp-tfa-img img')?.src;
            const tfaUrl = 'https://en.wikipedia.org' + dom.window.document.querySelector('#mp-tfa b:last-child a')?.href;
            const tfaParagraph = dom.window.document.querySelector('#mp-tfa')?.textContent.replace(imgCaption, '').replace('\n\n\n\n', '').split('(Full article...)\n')[0];
            const baseUrlImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png"

            res.status(200).json({
                'articleUrl': tfaUrl,
                'articleTitle': tfaTitle,
                'urlImage': tfaUrlImage ? "https:" + tfaUrlImage : baseUrlImage,
                'paragraph': tfaParagraph
            })

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Page Not Found" })
        }
    });

}