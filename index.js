let url = "https://api.punkapi.com/v2/beers?per_page=10";
let currentUrl;
const container = document.querySelector('.container');
const paginationPrev = document.querySelector('.prev');
const paginationNext = document.querySelector('.next');
const page = document.querySelector('.page');
const filterABV = document.getElementById("filterABV");
// let perPage = '&per_page=5';
let pageNumber = 1;

const error = (err) => console.log(err);

const render = (beers) => {
    console.log(beers);
    if (!beers.length) return;
    const fragment = document.createDocumentFragment();
    beers.forEach(({name, tagline, description, abv, image_url: imageURL}) => {
        const div = document.createElement('div');
        div.classList.add('beer');
        div.innerHTML = `
        <h1>${abv}</h1>
        <div class="bear">
        <div class="beer--content">
            <h1 class="beer--title">${name}</h1>
            <p class="beer--tagline">${tagline}</p>
            <p class="beer--description">${description}</p>
        </div>
        <img class="beer--image" src="${imageURL}">
        </div>
        `;
        fragment.appendChild(div);
    });

    container.textContent = '';
    container.appendChild(fragment);

    page.innerHTML = pageNumber;
    if (pageNumber === 1) {
        paginationPrev.setAttribute("disabled", "");
    } else if (pageNumber === 6) {
        paginationNext.setAttribute("disabled", "");
    } else {
        paginationPrev.removeAttribute("disabled");
        paginationNext.removeAttribute("disabled");
    }
}

filterABV.addEventListener("change", e => {
    const input = document.querySelector('.filter');
    console.log(input.value);
    const value = e.target.value;
    switch (value) {
        case "all":
            getBeers(urlOnLoad);
            break
        case "weak":
            currentUrl = new URL(url);
            currentUrl.searchParams.append('abv_lt', '4.6');
            // console.log(currentUrl.href + ' weak');
            break
        case "medium":
            currentUrl = new URL(url);
            currentUrl.searchParams.append('abv_gt', '4.5');
            currentUrl.searchParams.append('abv_lt', '7.6');
            nextPage();
            // console.log(currentUrl.href + ' medium');
            break
        case "strong":
            currentUrl = new URL(url);
            currentUrl.searchParams.append('abv_gt', '7.5');
            // console.log(currentUrl.href + ' strong');
            break
    }
    console.log(currentUrl);
    pageNumber = 1;
    getBeers(currentUrl);
});

const nextPage = () => {
    pageNumber++;
    urlOnLoad.searchParams.set('page', pageNumber);
    getBeers(currentUrl);
    console.log(currentUrl);
}
const prevPage = () => {
    pageNumber--;
    urlOnLoad.searchParams.set('page', pageNumber);
    getBeers(urlOnLoad);
}

paginationNext.addEventListener('click', nextPage);
paginationPrev.addEventListener('click', prevPage);

async function getBeers(currentUrl) {
    console.log(currentUrl);
    const beerPromise = await fetch(currentUrl);
    const beers = await beerPromise.json();
    render(beers);
}

let urlOnLoad = new URL(url);
getBeers(urlOnLoad);