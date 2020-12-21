interface Dom {
  readonly htmlElements: {
    readonly content: HTMLElement | null;
    readonly cases: HTMLElement | null;
    readonly world: HTMLElement | null;
    readonly map: HTMLElement | null;
    readonly casesTable: HTMLElement | null;
    readonly statsTable: HTMLElement | null;
    readonly stats: HTMLElement | null;
  };
  readonly attributes: {
    readonly search: string;
    readonly date: string;
    readonly countriesCount: string;
    readonly chart: string;
  };
  readonly classes: {
    readonly table: string;
    readonly active: string;
  };
}

const DOM: Dom = {
  htmlElements: {
    content: document.querySelector('.content'),
    cases: document.querySelector('.cases'),
    world: document.querySelector('.world'),
    map: document.querySelector('.world__map'),
    casesTable: document.querySelector('.cases__table'),
    statsTable: document.querySelector('.stats__table'),
    stats: document.querySelector('.stats'),
  },
  attributes: {
    search: '[data-search]',
    date: '[data-date-updated]',
    countriesCount: '[data-countries-count]',
    chart: '[data-chart]',
  },
  classes: {
    table: 'table',
    active: 'active',
  },
};

export default DOM;
