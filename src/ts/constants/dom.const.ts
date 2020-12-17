interface Dom {
  readonly htmlElements: {
    readonly content: HTMLElement | null;
    readonly cases: HTMLElement | null;
    readonly world: HTMLElement | null;
    readonly map: HTMLElement | null;
    readonly casesTable: HTMLElement | null;
  };
  readonly strings: {
    readonly casesGlobalAttr: string;
    readonly dateAttr: string;
    readonly countriesCountAttr: string;
  };
}

const DOM: Dom = {
  htmlElements: {
    content: document.querySelector('.content'),
    cases: document.querySelector('.cases'),
    world: document.querySelector('.world'),
    map: document.querySelector('.world__map'),
    casesTable: document.querySelector('.cases__table'),
  },
  strings: {
    casesGlobalAttr: '[data-cases-number]',
    dateAttr: '[data-date-updated]',
    countriesCountAttr: '[data-countries-count]',
  },
};

export default DOM;
