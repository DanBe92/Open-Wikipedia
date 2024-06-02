
async function saveArticle() {

    const articleData = JSON.parse(localStorage.getItem('fullArticleData'));

    const response = await fetch('http://127.0.0.1:8000/articles', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            articleData
        })
    });

    if (response.status === 201) {
        window.location.href = `/users/${user.id}/library`;
        return
    }

    const error = await response.json();

    alert(error.message)

};