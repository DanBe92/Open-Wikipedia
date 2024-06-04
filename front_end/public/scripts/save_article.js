
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
        window.location.href = `/users/library`;
        return
    }

    const error = await response.json();

    alert(error.message)
}


async function saveArticle(editedFlag) {

    if (!editedFlag) {

        articleData = JSON.parse(localStorage.getItem('fullArticleData'));

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

                console.log("SaveArticle", articleData);

                saveToDatabase()

            })
            .catch((reason) => {
                console.log(`Editor.js initialization failed because of ${reason}`)
            });

    } else {

        articleData = await editor.save();

        saveToDatabase()

    }
};


