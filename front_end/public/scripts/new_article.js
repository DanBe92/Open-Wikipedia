
async function saveToDatabase(articleData) {

    let isArticle = false;

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

    if (articleData.blocks[0].type !== 'image') {
        articleData.blocks.unshift({
            type: "image",
            data: {
                file: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png",
                },
                caption: "WikiLogo-img"
            }
        })
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


const editor = new EditorJS({
    holderId: 'editorjs',
    tools: {
        header: {
            class: Header,
        },
    },
    autofocus: true,
});

async function saveNewArticle() {

    const articleData = await editor.save();
    saveToDatabase(articleData);
    
}