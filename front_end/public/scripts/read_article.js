
const articleUrl = JSON.parse(localStorage.getItem('articleUrl'));
console.log(articleUrl);


(async () => {

    const response = await fetch('http://127.0.0.1:8000/getFullArticle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            articleUrl
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
        console.log(articleData);

        const div = document.querySelector('#articleContent');

        const img = document.querySelector('#articleImg');
        img.src = articleData.urlImage;
        img.alt = "article-img";

        const h1 = document.createElement('h1');
        h1.textContent = articleData.title;
        h1.className = 'text-xl';
        h1.classList.add('font-bold');
        div.appendChild(h1);

        articleData.paragraphs.forEach(par => {
            const p = document.createElement('p');
            p.textContent = par;
            div.appendChild(p);
        })
    }
})();


// Scraping

// document.querySelector('#scraping-button')
//     .addEventListener('click', async (e) => {
//         e.preventDefault();

//         const search = document.querySelector('#scraping-input').value;

//         const response = await fetch('http://127.0.0.1:8000/scraping', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 search
//             })
//         })
//         const data = await response.json();
//         console.log(data);

//         const div = document.createElement('div');

//         const img = document.createElement('img');
//         img.src = data.urlImage;
//         div.appendChild(img);

//         const h1 = document.createElement('h1');
//         h1.textContent = data.title;
//         div.appendChild(h1);

//         data.paragraphs.forEach(paragraph => {
//             const p = document.createElement('p');
//             p.textContent = paragraph;
//             div.appendChild(p);
//         })

//         body.appendChild(div)
//     });