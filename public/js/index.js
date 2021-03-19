import {
    Obserify,
    html,
    render
} from './urjs/src/script/index.js';

let cards = new Obserify.List(
    {
        id: 0,
        title: 'Title',
        community: 'Community',
        collect: 0,
        target: 1000000,
        restOfDay: 90
    }
);

const addCard = (event) => {
    cards.fill({
        id: cards.length,
        title: 'Help Foo',
        collect: 0,
        community: 'Foo fans',
        restOfDay: 99,
        target: 1000000000
    }).commit();
}

const preset = html `
    <>
        <div class="row m-0 cards-category">
            ${(html) => {
                for (const card of cards) {
                    html`
                        <div class="row g-2 shadow rounded cards-category" data-id="${card.id}">
                            <div class="col-6 cards-category-img">
                                <div class="border bg-secondary rounded-3 d-flex align-items-center h-100">
                                    <i class="bi-image m-auto h1"></i>
                                </div>
                            </div>
                            <div class="col-6 py-1 d-grid cards-category-text">
                                <div class="row align-self-start ">
                                    <h1 class="fs-3">${card.title}</h1>
                                    <h2 class="fs-5 my-1">${card.community}</h2>
                                </div>
                                <div class="row align-items-center px-4 ">
                                    <div class="progress rounded p-0">
                                        <div class="progress-bar bg-secondary" role="progressbar" style="width: 50%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div class="row align-self-end">
                                    <div class="col-6">
                                        <h3 class="fs-6">terkumpul</h3>
                                        <h2 class="fs-5">${card.collect}</h2>
                                    </div>
                                    <div class="col-6 text-end">
                                        <h3 class="fs-6">sisa hari</h3>
                                        <h2 class="fs-5">${card.restOfDay}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                return cards
            }}
        </div>
        <div class="row m-0 g-4">
            <div class="col-12 d-flex justify-content-center">
                <button class="btn btn-secondary" onclick="${addCard}">
                    lainnya
                </button>
            </div>
        </div>
    </>
`;

render(preset, '.container.comp-category');
