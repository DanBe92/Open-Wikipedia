
function clearArticleData(flag = null) {

    document.querySelector('#textContent')?.remove();

    if (!flag) {
        document.querySelector('#infoLimitedArticle').style.display = "none";
        document.querySelector('#readFullArticle').style.display = "none";
        document.querySelector('#infoFullArticle').style.display = "block";
        document.querySelector('#readLimitedArticle').style.display = "block";
    } else {
        document.querySelector('#infoLimitedArticle').style.display = "block";
        document.querySelector('#readFullArticle').style.display = "block";
        document.querySelector('#infoFullArticle').style.display = "none";
        document.querySelector('#readLimitedArticle').style.display = "none";
    }
}


function createArticle(articleData) {

    const articleContent = document.querySelector('#articleContent');

    const div = document.createElement('div');
    div.id = 'textContent';
    div.className = 'flex';
    div.classList.add('flex-col', 'gap-8');

    const img = document.querySelector('#articleImg');
    img.src = articleData.urlImage;
    img.alt = articleData.title + "-img";

    const h1 = document.createElement('h1');
    h1.textContent = articleData.title;
    h1.className = 'text-3xl';
    h1.classList.add('font-bold');

    div.appendChild(h1);

    articleData.paragraphs.forEach(par => {
        const p = document.createElement('p');
        p.textContent = par;
        div.appendChild(p);
    })

    articleContent.appendChild(div);
}


async function showArticle(limit = 6, clearFlag = 1) {

    clearArticleData(clearFlag);

    const articleUrl = JSON.parse(localStorage.getItem('articleUrl'));

    if (articleUrl) {
        const response = await fetch('http://127.0.0.1:8000/getFullArticle', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articleUrl,
                limit
            })
        })

        if (response.status !== 200) {
            const searchDiv = document.querySelector('#searchDiv');

            const div = document.createElement('div');
            div.id = "searchResults"
            div.className = 'menu';
            div.classList.add('flex', 'flex-col', 'justify-start', 'gap-4', 'text-lg', 'font-semibold')

            const h2 = document.createElement('h2');
            h2.textContent = "Couldn't load the article";
            h2.style.color = 'red';

            div.appendChild(h2);
            searchDiv.appendChild(div);
        } else {
            const articleData = await response.json();
            localStorage.removeItem('fullArticleData');
            localStorage.setItem('fullArticleData', JSON.stringify(articleData));
            createArticle(articleData);
        }

        return

    } else {
        document.querySelector('#infoLimitedArticle').style.display = "none";
        document.querySelector('#readFullArticle').style.display = "none";
        document.querySelector('#infoFullArticle').style.display = "none";
        document.querySelector('#readLimitedArticle').style.display = "none";
        const articleData = JSON.parse(localStorage.getItem('fullArticleData'));
        createArticle(articleData);
    }
};


showArticle();


document.querySelector('#readFullArticle')
    .addEventListener('click', (e) => {
        e.preventDefault();
        showArticle(999, null);
    });

document.querySelector('#readLimitedArticle')
    .addEventListener('click', (e) => {
        e.preventDefault();
        showArticle();
    });