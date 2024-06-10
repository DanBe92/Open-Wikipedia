
async function saveToDatabase() {

    let pageId = JSON.parse(localStorage.getItem('pageId'));

    let isArticle = true;
    if (pageId === 0) {
        isArticle = false;
    }

    while (!isArticle) {

        pageId = Math.floor(Math.random() * 9999999999);

        const res = await fetch('http://localhost:8000/checkArticle', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pageId
            })
        });

        isArticle = await res.json();
    }

    const response = await fetch('http://localhost:8000/articles', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            articleData,
            pageId
        })
    });

    if (response.status === 201) {
        localStorage.removeItem('pageId');
        window.location.href = `/user/library`;
        return
    }

    const error = await response.json();

    alertHandler(error.message)
}


async function saveNewArticle() {

    articleData = JSON.parse(localStorage.getItem('fullArticleData'));

    let blocksData = [
        {
            type: "image",
            data: {
                file: {
                    url: articleData.urlImage ? articleData.urlImage : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png",
                },
                caption: articleData.title + "-img"
            }
        },
        {
            type: "header",
            data: {
                text: articleData.title,
                level: 1,
            }
        },
    ];

    articleData.paragraphs.forEach(par => {
        blocksData.push({
            type: "paragraph",
            data: {
                text: par,
            }
        })
    })

    const editor = new EditorJS({
        holderId: 'editorjs',
        tools: {
            header: {
                class: Header,
            },
            image: {
                class: ImageTool,
                config: {
                    endpoints: {
                        byUrl: articleData.urlImage ? articleData.urlImage : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png",
                    }
                }
            }
        },
        autofocus: true,
        data: {
            blocks: blocksData,
        }
    });

    editor.isReady
        .then(async () => {

            articleData = await editor.save()

            let pageId = JSON.parse(localStorage.getItem('pageId'));

            const res = await fetch('http://localhost:8000/checkArticle', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pageId
                })
            });

            const article = await res.json();

            if (article.isArticle) {

                confirmModal.showModal();
                document.querySelector('#confirmTitle').textContent = "Article Found";
                document.querySelector('#confirmMessage').textContent = "This article is already saved in your library. Do you want to save it anyway? Previous data will be lost. Confirm to proceed.";
                document.querySelector('#confirmButton').onclick = () => {
                    confirmModal.close();
                    saveToDatabase();
                }

            } else {
                saveToDatabase()
            }

        })
        .catch((reason) => {
            console.log(`Editor.js initialization failed because of ${reason}`)
        });
};

async function saveEditedArticle() {
    const pageId = JSON.parse(localStorage.getItem('pageId'));

    const response = await fetch('http://localhost:8000/checkArticle', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pageId
        })
    });

    const isArticle = await response.json();

    articleData = await editor.save();

    if (isArticle.isArticle) {
        confirmModal.showModal();
        document.querySelector('#confirmTitle').textContent = "Article Found";
        document.querySelector('#confirmMessage').textContent = "This article is already saved in your library. Do you want to save it anyway? Previous data will be lost. Confirm to proceed.";
        document.querySelector('#confirmButton').onclick = () => {
            confirmModal.close();
            saveToDatabase();
        }
    } else {
        saveToDatabase();
    }
}
