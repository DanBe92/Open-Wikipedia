
async function saveToDatabase() {

    let pageId = JSON.parse(localStorage.getItem('pageId'));

    // if (!pageId) {
    //     pageId = 9999999999;
    //     let customPageIds = JSON.parse(localStorage.getItem('customPageIds'));

    //     console.log("Custom", customPageIds);

    //     if (!customPageIds) {
    //         customPageIds = [];
    //     }

    //     while (customPageIds.includes(pageId)) {
    //         pageId++
    //         console.log('Page log:', pageId);
    //     }

    //     customPageIds.push(pageId);
    //     localStorage.setItem('customPageIds', JSON.stringify(customPageIds))
    // }

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

    alert(error.message)
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

                if (confirm("This article is already saved in your library. Do you want to save it anyway? Previous data will be lost. Confirm to proceed.") == false) {
                    return
                }

            }

            saveToDatabase()

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

    if (isArticle) {
        if (confirm("This article is already saved in your library. Do you want to save it anyway? Previous data will be lost. Confirm to proceed.") == false) {
            return
        }
    }

    saveToDatabase("Update");
}
