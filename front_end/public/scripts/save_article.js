
async function saveToDatabase() {

    const pageId = JSON.parse(localStorage.getItem('pageId'));

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
        window.location.href = `/user/library`;
        return
    }

    const error = await response.json();

    alert(error.message)
}


async function saveNewArticle() {

    articleData = JSON.parse(localStorage.getItem('fullArticleData'));
    articleAlreadyInLibrary = JSON.parse(localStorage.getItem('articleAlreadyInLibrary'));

    let blocksData = [
        {
            type: "image",
            data: {
                file: {
                    url: articleData.urlImage
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
                        byUrl: articleData.urlImage,
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

            if (articleAlreadyInLibrary) {

                if (confirm("This article is already saved in your library. Do you want to save it anyway? Previous data will be lost. Confirm to proceed.") == false) {
                    return
                }

                localStorage.removeItem('articleAlreadyInLibrary');
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

    const checkArticle = await response.json();

    articleData = await editor.save();

    if (checkArticle) {
        if (confirm("This article is already saved in your library. Do you want to save it anyway? Previous data will be lost. Confirm to proceed.") == false) {
            return
        }
    }

    saveToDatabase("Update");
}