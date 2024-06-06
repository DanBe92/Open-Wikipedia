
let articleData = JSON.parse(localStorage.getItem('fullArticleData'))

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
