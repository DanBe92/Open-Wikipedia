
(async () => {

    const dailyResult = await fetch(`${localhost}/dailyArticlePreview`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    const dailyData = await dailyResult.json();

    document.querySelector('#fullArticleButton').onclick = () => {
        localStorage.setItem('articleUrl', JSON.stringify(dailyData.articleUrl))
        window.location.href = `/user/read_article`
    };

    document.querySelector('#articleImg').src = dailyData.urlImage;
    document.querySelector('#todaysArticleTitle').textContent = dailyData.articleTitle;
    document.querySelector('#todaysArticleContent').textContent = dailyData.paragraph;
})();