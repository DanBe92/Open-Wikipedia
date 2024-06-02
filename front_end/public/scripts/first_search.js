
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

        const response = await fetch('http://127.0.0.1:8000/firstSearch', {
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
                            'searchQuery': article.pageId
                        })
                    });

                    const articleUrl = await response.json();

                    localStorage.setItem('articleUrl', JSON.stringify(articleUrl))
                    window.location.href = `/users/${user.id}/read_article`
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



// Happened Today

// document.querySelector('#daily-button')
//     .addEventListener('click', async (e) => {
//         e.preventDefault();

//         const dailyResult = await fetch('http://127.0.0.1:8000/daily_article')

//         const dailyData = await dailyResult.json();

//         console.log(dailyData);

//     });



