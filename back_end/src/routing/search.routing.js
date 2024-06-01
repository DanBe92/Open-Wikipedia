import wiki from 'wikipedia';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export default function searchRouting(app) {

    app.post('/getPageUrl', async (req, res) => {
        try {
            const searchQuery = req.body.searchQuery;
            // const language = await wiki.setLang('it');

            const page = await wiki.page(searchQuery);

            // const summary = await page.summary();
            res.status(200).json(page.fullurl)

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Page Not Found" })
        }
    })

    app.post('/firstSearch', async (req, res) => {
        try {
            const searchQuery = req.body.firstSearch ? req.body.firstSearch : req.body.suggestion;

            if (searchQuery !== undefined) {

                // const language = await wiki.setLang('it');
                const searchResults = await wiki.search(searchQuery, {suggestion: true, limit: 5})
                
                const resultIds = searchResults.results.map(result => {
                    return {'title': result.title, 'pageId': result.pageid};
                });

                res.status(200).json(resultIds)
                return
            }

            res.status(404).json({ message: "Page Not Found" })

        } catch (error) {
            console.log("Error:", error);
            res.status(404).json({ message: "Page Not Found" })
        }
    })

    app.get('/daily_article', async (req, res) => {
        try {

            // const language = await wiki.setLang('it');

            const dailyResults = await wiki.onThisDay({ limit: 3 });

            console.log(dailyResults);

            res.status(200).json(dailyResults)

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Page Not Found" })
        }
    })

    app.post('/getFullArticle', async (req, res) => {
        try {

            // const title = req.body.search
            // const url = `https://en.wikipedia.org/wiki/${title}`;
            
            const url = req.body.articleUrl
            const data = await axios.get(url);

            const dom = new JSDOM(data.data);

            const domTitle = dom.window.document.querySelector('#firstHeading').textContent;
            let paragraphs = [];
            let urlImage;

            console.log("Dom Title:", domTitle);

            dom.window.document.querySelectorAll('#mw-content-text p').forEach((p, index) => {

                if (index === 0 || index >= 6) {
                    return
                }

                const paragraph = p.textContent.replace(/\[(.+?)\]/g, "")
                paragraphs.push(paragraph)
                console.log(paragraph)

                urlImage = "https:" + dom.window.document.querySelector('.mw-file-description img').src;

            });

            res.json({
                'title': domTitle,
                'paragraphs': paragraphs,
                'urlImage': urlImage ? urlImage : undefined
            })

        } catch (error) {
            console.log(`Error: ${error}`);
            res.status(404).json({message : "Article not Found"})
            
        }
    })

}