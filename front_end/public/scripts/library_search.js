
const searchLibraryInput = document.querySelector('#searchInLibraryInput');


localStorage.setItem('paginationSearch', 0)

function paginationSearch(value) {
    const paginationSearch = +localStorage.getItem('paginationSearch') + value

    if (paginationSearch < 0) {
        localStorage.setItem('paginationSearch', 0)
        return
    } else {
        getSearchArticles(paginationSearch)
    }

    localStorage.setItem('paginationSearch', paginationSearch)
}

// Search in Library
async function getSearchArticles(paginationSearch = 0) {

    const librarySearch = searchLibraryInput.value;

    if (!librarySearch) {
        return
    }

    const response = await fetch(`${localhost}/getArticlesByName`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            librarySearch,
            paginationSearch
        })
    });

    const data = await response.json();

    if (!data.isArticle) {
        const h2 = document.createElement('h2');
        h2.textContent = "This search has no results.";
        h2.style.color = 'red';
        h2.id = 'librarySearchNoResults';
        document.querySelector('#searchFormId').appendChild(h2);
        return
    }

    localStorage.removeItem('articlePageId')

    if (data.articles.length > 0) {

        document.querySelector('#paginationSearchLibraryButtons').style.display = 'flex';
        document.querySelector('#paginationButtons').style.display = 'none';

        showArticles(data.articles);

        return

    }

    localStorage.setItem('paginationSearch', paginationSearch - 9)

};

document.querySelector('#searchInLibraryButton')
    .addEventListener('click', async (e) => {
        e.preventDefault();
        getSearchArticles();
    });