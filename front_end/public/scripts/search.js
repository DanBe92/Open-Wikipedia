
const body = document.querySelector('body')

document.querySelector('#summary-button')
    .addEventListener('click', async (e) => {
        e.preventDefault();

        const searchQuery = document.querySelector('#summary-input').value;

        const response = await fetch('http://127.0.0.1:8000/testSummary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchQuery
            })
        })
        const data = await response.json();
        console.log(data);

        const div = document.createElement('div');

        const h2 = document.createElement('h2');
        h2.textContent = data.title;

        const p = document.createElement('p');
        p.textContent = data.extract;

        div.appendChild(h2);
        div.appendChild(p);

        body.appendChild(div)
    });

document.querySelector('#complete-button')
    .addEventListener('click', async (e) => {
        e.preventDefault();

        const searchQuery = document.querySelector('#complete-input').value;

        const response = await fetch('http://127.0.0.1:8000/testCompleteArticle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchQuery
            })
        })
        const data = await response.json();
        console.log("data", data);

        const div = document.createElement('div');

        if (data.results.length > 0) {

            data.results.forEach(result => {


                const h2 = document.createElement('h2');
                h2.textContent = result.title;

                // const p = document.createElement('p');
                // p.textContent = data.extract;

                div.appendChild(h2);
                // div.appendChild(p);
            })

            body.appendChild(div)

            return

        }

        const suggestionResponse = await fetch('http://127.0.0.1:8000/testCompleteArticle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                'suggestion': data.suggestion
            }
        })

        const suggestionData = await suggestionResponse.json();
        console.log("suggestionData", suggestionData);

        const h2 = document.createElement('h2');
        h2.textContent = result.title;

        // const p = document.createElement('p');
        // p.textContent = data.extract;

        div.appendChild(h2);
        // div.appendChild(p);

        body.appendChild(div)

        return


    })

