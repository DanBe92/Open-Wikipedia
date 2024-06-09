
const searchDiv = document.querySelector('#searchDiv');

function clearSearch() {
    localStorage.removeItem('articleUrl')
    document.querySelector('#searchResults')?.remove();
    document.querySelector('#emptySearch')?.remove();
}


// First Search
document.querySelector('#searchButton')
    .addEventListener('click', async (e) => {
        e.preventDefault();

        clearSearch();

        const firstSearch = document.querySelector('#searchInput').value;

        if (!firstSearch) {
            const span = document.createElement('span');
            span.textContent = "Search field can't be empty";
            span.classList.add('text-sm', 'self-center')
            span.id = 'emptySearch';
            span.style.color = 'red';
            searchDiv.parentNode.insertBefore(span, searchDiv.nextSibling);
            return
        }

        const response = await fetch('http://localhost:8000/firstSearch', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstSearch
            })
        })

        const data = await response.json();

        const div = document.createElement('div');
        div.id = "searchResults"
        div.className = 'menu';
        div.classList.add('flex', 'flex-col', 'justify-start', 'gap-4', 'text-lg', 'font-semibold')

        if (data?.length > 0) {

            data.forEach(article => {

                const h2 = document.createElement('h2');
                h2.textContent = article.title;
                const li = document.createElement('li');

                li.onclick = async () => {

                    const response = await fetch('http://localhost:8000/getPageUrl', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'pageId': article.pageId
                        })
                    });

                    const articleUrlandCheckDouble = await response.json();

                    console.log("articleUrlandCheckDouble", articleUrlandCheckDouble);

                    if (articleUrlandCheckDouble.isArticle) {

                        confirmModal.showModal();
                        document.querySelector('#confirmTitle').textContent = "Action Required";
                        document.querySelector('#confirmMessage').textContent = "This article is already saved in your library. Do you want to search for it again? Confirm to proceed.";
                        document.querySelector('#confirmButton').onclick = () => {
                            confirmModal.close();
                            localStorage.setItem('articleUrl', JSON.stringify(articleUrlandCheckDouble.articleUrl))
                            localStorage.setItem('pageId', JSON.stringify(article.pageId))
                            window.location.href = `/user/read_article`
                        }

                    } else {
                        localStorage.setItem('articleUrl', JSON.stringify(articleUrlandCheckDouble.articleUrl))
                        localStorage.setItem('pageId', JSON.stringify(article.pageId))
                        window.location.href = `/user/read_article`
                    }

                    return
                }

                li.appendChild(h2);
                div.appendChild(li);

            })

            searchDiv.appendChild(div);

            return

        } else {
            const h2 = document.createElement('h2');
            h2.textContent = "This search has no results.";
            h2.style.color = 'red';
            div.appendChild(h2);
            searchDiv.appendChild(div);
        }
    });