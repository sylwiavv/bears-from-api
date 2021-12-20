const API_URL = 'https://api.punkapi.com/v2/beers';
const container = document.querySelector('.container');
const paginationPrev = document.querySelector('.prev');
const paginationNext = document.querySelector('.next');
const page = document.querySelector('.page');

const API_URL_PAGINATION = 'https://api.punkapi.com/v2/beers?page=1&per_page=10';
let pageNumber = 1;

const nextPage = () => {
    pageNumber++;
    getBeers();
}

const prevPage = () => {
    pageNumber--;
    getBeers();
}

paginationNext.addEventListener('click', nextPage);
paginationPrev.addEventListener('click', prevPage);


const error = (err) => console.log(err);

const render = (beers) => {
    if (!beers.length) return;
    const fragment = document.createDocumentFragment();
    beers.forEach(({ name, tagline, description, image_url: imageURL }) => {
        const div = document.createElement('div');
        div.classList.add('beer');
        div.innerHTML = `
        <div class="beer--content">
            <h1 class="beer--title">${name}</h1>
            <p class="beer--tagline">${tagline}</p>
            <p class="beer--description">${description}</p>
        </div>
        <img class="beer--image" src="${imageURL}">
        `;
        fragment.appendChild(div);
    });
    page.innerHTML = pageNumber;
    container.appendChild(fragment);

    if (pageNumber === 1) {
        paginationPrev.setAttribute("disabled", "");
    } else if (pageNumber === 6) {
        paginationNext.setAttribute("disabled", "");
    } else {
        paginationPrev.removeAttribute("disabled");
        paginationNext.removeAttribute("disabled");
    }
}

async function getBeers() {
    fetch(API_URL_PAGINATION)
    .catch(error)
    const beerPromise = await fetch('https://api.punkapi.com/v2/beers?page=' + `${pageNumber}` + '&per_page=5');
    const beers = await beerPromise.json();
    console.log(beers);
    render(beers);
}

getBeers();