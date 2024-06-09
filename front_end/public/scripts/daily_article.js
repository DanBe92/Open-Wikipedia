
(async () => {

    const dailyResult = await fetch('http://127.0.0.1:8000/dailyArticlePreview')

    const dailyData = await dailyResult.json();

    document.querySelector('#fullArticleButton').onclick = () => {
        localStorage.setItem('articleUrl', JSON.stringify(dailyData.articleUrl))
        window.location.href = `/user/read_article`
    };

    document.querySelector('#articleImg').src = dailyData.urlImage;
    document.querySelector('#todaysArticleTitle').textContent = dailyData.articleTitle;
    document.querySelector('#todaysArticleContent').textContent = dailyData.paragraph;

})();