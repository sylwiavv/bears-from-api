let url = "https://api.punkapi.com/v2/beers?per_page=9";
let currentUrl;
const container = document.querySelector('.container');
const paginationPrev = document.querySelector('.prev');
const paginationNext = document.querySelector('.next');
const page = document.querySelector('.page--number');
const filterABV = document.getElementById("filterABV");
let pageNumber = 1;
container.classList.add('on-load');

const render = (beers) => {
    if (!beers.length) return;
    const fragment = document.createDocumentFragment();
    beers.forEach(({name, tagline, description, abv, image_url: imageURL}) => {
        const div = document.createElement('div');
        div.classList.add('beer');
        div.innerHTML = `
        <img class="beer--image animate-pop" src="${imageURL}">
        <div class="beer--content">
            <h3 class="beer--title">${name}</h3>
            <p class="beer--abv"><span>Abv:</span> ${abv}%</p>
            <p class="beer--tagline">${tagline}</p>
        </div>
        `;
        fragment.appendChild(div);
    });

    container.textContent = '';
    container.appendChild(fragment);
    page.innerHTML = pageNumber;
    if (pageNumber === 1) {
        paginationPrev.setAttribute("disabled", "");
        paginationPrev.classList.add('disabled');
        paginationNext.classList.remove('disabled');
        paginationNext.removeAttribute("disabled");
    } else if (pageNumber === 5) {
        paginationNext.setAttribute("disabled", "");
        paginationNext.classList.add('disabled');
    } else {
        paginationPrev.removeAttribute("disabled");
        paginationPrev.classList.remove('disabled');
        paginationNext.classList.remove('disabled');
    }
}

filterABV.addEventListener("change", e => {
    const value = e.target.value;
    switch (value) {
        case "all":
            currentUrl = new URL(url);
            break
        case "weak":
            currentUrl = new URL(url);
            currentUrl.searchParams.append('abv_lt', '4.6');
            break
        case "medium":
            currentUrl = new URL(url);
            currentUrl.searchParams.append('abv_gt', '4.5');
            currentUrl.searchParams.append('abv_lt', '7.6');
            break
        case "strong":
            currentUrl = new URL(url);
            currentUrl.searchParams.append('abv_gt', '7.5');
            break
    }
    pageNumber = 1;
    getBeers(currentUrl);
});

const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const nextPage = () => {
    pageNumber++;
    currentUrl.searchParams.set('page', pageNumber);
    getBeers(currentUrl);
    scrollTop();
}

const prevPage = () => {
    pageNumber--;
    currentUrl.searchParams.set('page', pageNumber);
    getBeers(currentUrl);
    scrollTop();
}

setTimeout(function(){
    container.classList.remove('on-load');
    currentUrl = new URL(url);
    getBeers(currentUrl);
}, 1500);

async function getBeers(currentUrl) {
    const beerPromise = await fetch(currentUrl);
    if (beerPromise.ok) {
        const beers = await beerPromise.json();
        container.classList.add('animate-pop');
        render(beers);
        return beers;
    } else {
        return `HTTP error: ${beerPromise.status}`;
    }
}

paginationNext.addEventListener('click', nextPage);
paginationPrev.addEventListener('click', prevPage);

