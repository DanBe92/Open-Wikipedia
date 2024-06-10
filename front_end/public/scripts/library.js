// Article Delete

function articleDelete(pageId) {

    fetch(`http://localhost:8000/article`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pageId
        })
    })
        .then(res => res.json())
        .then(article => {
            console.log(article);
            if (article.message) {
                alertHandler(article.message);
            } else {
                alertHandler(`The article ${article.articleData.blocks[1].data.text} has been deleted.`, 'Action Success');
                document.querySelector('#alertButton').onclick = () => {
                    alertModal.close();
                    localStorage.removeItem('pageId');
                    window.location.href = '/user/library';
                };

            }
        })
}


async function getUserArticles(pagination = 0) {
    const response = await fetch(`http://localhost:8000/getUserArticles`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pagination })
    });

    const articlesObjectList = await response.json();

    if (articlesObjectList.length > 0) {

        document.querySelector('#articlesTable').innerHTML = '';

        articlesObjectList.forEach(wrongFormatArticleData => {

            const articleData = formatData(wrongFormatArticleData);

            const articlesTable = document.querySelector('#articlesTable');

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card lg:card-side bg-base-100 shadow-xl';

            const figure = document.createElement('figure');

            const img = document.createElement('img');
            img.className = 'max-h-60 max-w-60';
            img.src = articleData.urlImage;
            figure.appendChild(img);

            cardDiv.appendChild(figure);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body justify-between items-center bg-gray-100';

            const h2 = document.createElement('h2');
            h2.className = 'card-title text-center';
            h2.textContent = articleData.title;

            const cardActionsDiv = document.createElement('div');
            cardActionsDiv.className = 'card-actions lg:flex-col justify-center items-center';

            const buttonEdit = document.createElement('button');
            buttonEdit.className = 'btn btn-outline';
            buttonEdit.textContent = 'Edit';

            buttonEdit.onclick = () => {
                localStorage.setItem('fullArticleData', JSON.stringify(articleData));
                localStorage.setItem('pageId', JSON.stringify(wrongFormatArticleData.pageId));
                window.location.href = `/user/edit_article`
            };

            const buttonDelete = document.createElement('button');
            buttonDelete.className = 'btn bg-red-400';
            buttonDelete.textContent = 'Delete';

            buttonDelete.onclick = () => {
                confirmModal.showModal();
                document.querySelector('#confirmTitle').textContent = "Action Required";
                document.querySelector('#confirmMessage').textContent = "This action will DELETE this article. Confirm to proceed.";
                document.querySelector('#confirmButton').onclick = () => {
                    confirmModal.close();
                    articleDelete(wrongFormatArticleData.pageId);
                }
            };

            cardActionsDiv.appendChild(buttonEdit);
            cardActionsDiv.appendChild(buttonDelete);

            cardBody.appendChild(h2);
            cardBody.appendChild(cardActionsDiv);

            cardDiv.appendChild(cardBody);

            articlesTable.appendChild(cardDiv);

        });

        return
    }

    localStorage.setItem('pagination', pagination - 9)

};

getUserArticles();

localStorage.setItem('pagination', 0)

function pagination(value) {
    const pagination = +localStorage.getItem('pagination') + value

    if (pagination < 0) {
        localStorage.setItem('pagination', 0)
        return
    } else {
        getUserArticles(pagination)
    }

    localStorage.setItem('pagination', pagination)
}

