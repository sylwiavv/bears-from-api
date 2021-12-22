const urlBase = new URL("https://api.punkapi.com/v2/beers?page=1");
const container = document.querySelector('.container');
const paginationPrev = document.querySelector('.prev');
const paginationNext = document.querySelector('.next');
const page = document.querySelector('.page');
const filterABV = document.getElementById("filterABV");

let optionsABV = "";
let perPage = '&per_page=10';
let pageNumber = 1;

const nextPage = () => {
    pageNumber++;
    console.log(pageNumber);
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
    console.log(beers);
    if (!beers.length) return;
    const fragment = document.createDocumentFragment();
    beers.forEach(({ name, tagline, description, abv, image_url: imageURL }) => {
        const div = document.createElement('div');
        div.classList.add('beer');
        div.innerHTML = `
        <img class="beer--image" src="${imageURL}">
        <div class="beer--content">
            <h1 class="beer--title">${name}</h1>
            <p class="beer--tagline">${tagline}</p>
            <p>ABV: <strong>${abv}</strong></p>
            <p class="beer--description">${description}</p>
        </div>
        `;
        fragment.appendChild(div);
    });

    container.textContent = '';
    container.appendChild(fragment);

    console.log(pageNumber);

    page.innerHTML = pageNumber;
    if (pageNumber === 1) {
        paginationPrev.setAttribute("disabled", "");
        paginationPrev.classList.add('hidden');
    } else if (pageNumber === 6) {
        paginationNext.setAttribute("disabled", "");
        paginationNext.classList.add('hidden');
    } else {
        paginationPrev.removeAttribute("disabled");
        paginationNext.removeAttribute("disabled");
        paginationNext.classList.remove('hidden');
        paginationPrev.classList.remove('hidden');
    }
}

filterABV.addEventListener("change", e => {
    const value = e.target.value;
    console.log(value);

    switch (value) {
        case "all":
            optionsABV = "";
            break
        case "weak":
            // optionsABV = "&abv_lt=4.6";
            urlBase.searchParams.append("&abv_lt", "4.6");
            break
        // case "medium":
        //     optionsABV = "&abv_gt=4.5&abv_lt=7.6";
        //     urlBase.searchParams.append("abv_lt", "4.6");
        //     break
        case "strong":
            // optionsABV = "&abv_gt=7.5";
            urlBase.searchParams.append("&abv_gt", "7.5");
            break
    }
    pageNumber = 1;
    getBeers();
})

async function getBeers() {
    // const url = urlBase + pageNumber + optionsABV + perPage;
    const beerPromise = await fetch(urlBase);
    const beers = await beerPromise.json();
    // console.log(url);
    console.log(urlBase.href);
    render(beers);
}

getBeers();
