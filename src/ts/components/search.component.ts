import * as Api from '../data/api.data';
import { casesTable, statsTable } from '../index';

export default class SearchComponent {
  private parent!: HTMLElement;

  private searchAttr: string;

  constructor(parent: HTMLElement, searchAttr: string) {
    this.parent = parent;
    this.searchAttr = searchAttr;
    this.init();
  }

  private init = (): void => {
    const component: string = `<div class="cases__search">
                                <h2 class="cases__title">Searching</h2>
                                <input class="cases__input" ${this.searchAttr.slice(1, -1)}
                                  type="text" placeholder="Country">
                              </div>`;
    this.parent?.insertAdjacentHTML('afterbegin', component);
  };

  private search = (value: string, data: Api.CovidCountries[]): any[] => {
    const filteredData: any[] = [];

    for (let i = 0; i < data.length; i++) {
      value = value.toLowerCase();
      const country = data[i].country.toLowerCase();

      if (country.includes(value)) {
        filteredData.push(data[i]);
      }
    }

    return filteredData;
  };

  public initSearching = (summary: Api.CovidSummary, countries: Api.CovidCountries[]): void => {
    const input: any = this.parent.querySelector(this.searchAttr);

    input?.addEventListener('keyup', () => {
      const { value } = input;
      const dataCases = this.search(value, countries);
      const dataStats = this.search(value, countries);

      casesTable.fillTable(dataCases);

      if (value) {
        statsTable.fillTableFiltered(dataStats);
      } else {
        statsTable.fillTableDefault(summary);
      }
    });
  };
}
