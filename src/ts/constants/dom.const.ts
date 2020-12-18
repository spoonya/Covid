interface Dom {
  readonly htmlElements: {
    readonly content: HTMLElement | null;
    readonly cases: HTMLElement | null;
    readonly world: HTMLElement | null;
    readonly map: HTMLElement | null;
    readonly casesTable: HTMLElement | null;
    readonly statsTable: HTMLElement | null;
  };
  readonly attributes: {
    readonly casesGlobal: string;
    readonly date: string;
    readonly countriesCount: string;
  };
  readonly classes: {
    readonly table: string;
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
  },
  attributes: {
    casesGlobal: '[data-cases-number]',
    date: '[data-date-updated]',
    countriesCount: '[data-countries-count]',
  },
  classes: {
    table: 'table',
  },
};

export default DOM;
