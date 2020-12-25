import * as Api from '../data/api.data';
import { casesTable, statsTable, chart } from '../index';
import DOM from '../constants/dom.const';

export default class SearchComponent {
  private parent!: HTMLElement;

  private searchAttr: string;

  private activeRow!: HTMLElement | null;

  constructor(parent: HTMLElement, searchAttr: string) {
    this.parent = parent;
    this.searchAttr = searchAttr;
    this.init();
  }

  private init = (): void => {
    const component: string = `<div class="cases__search">
                                <h2 class="cases__title" spellcheck="false">Search</h2>
                                <input class="cases__input" ${this.searchAttr.slice(1, -1)}
                                  type="text" placeholder="Country">
                                  <button ${
                                    DOM.attributes.btnClear
                                  }><i class="icon fas fa-times" title="Clear"></i></button>
                              </div>`;
    this.parent?.insertAdjacentHTML('afterbegin', component);
  };

  private search = (value: string, data: Api.CovidCountries[], isStrict: boolean = false): Api.CovidCountries[] => {
    const filteredData: Api.CovidCountries[] = [];
    const dataLength = data.length;

    for (let i = 0; i < dataLength; i++) {
      value = value.toLowerCase();
      const country = data[i].country.toLowerCase();

      if (isStrict) {
        if (country === value) {
          filteredData.push(data[i]);
        }
      } else if (country.includes(value)) {
        filteredData.push(data[i]);
      }
    }

    return filteredData;
  };

  private addClickEvtToClearBtn = (
    summary: Api.CovidSummary,
    countries: Api.CovidCountries[],
    history: Api.CovidHistory,
  ) => {
    const btnClear = document.querySelector('button');

    btnClear?.addEventListener('click', () => {
      const input: any = this.parent.querySelector(this.searchAttr);

      if (input.value) {
        input!.value = '';
        statsTable.fillTableDefault(summary, history);
        chart.updateChart();
        casesTable.fillTable(countries);
        this.addClickEvtToTable(summary, countries, history);
      }
    });
  };

  private addClickEvtToTable = (
    summary: Api.CovidSummary,
    countries: Api.CovidCountries[],
    history: Api.CovidHistory,
  ): void =>
    DOM.htmlElements.casesTable?.querySelectorAll('tr').forEach((row: HTMLElement) => {
      row.addEventListener('click', () => {
        const country = row.id;

        if (!this.activeRow || (this.activeRow && this.activeRow !== row)) {
          const data = this.search(country!, countries, true);

          statsTable.fillTableFiltered(data, country);
          chart.updateChart(country);
          this.activeRow?.classList.remove(DOM.classes.active);
          row.classList.add(DOM.classes.active);
          this.activeRow = row;
        } else {
          chart.updateChart();
          statsTable.fillTableDefault(summary, history);
          this.activeRow.classList.remove(DOM.classes.active);
          this.activeRow = null;
        }
      });
    });

  private addKeyupEvtToInput = (
    summary: Api.CovidSummary,
    countries: Api.CovidCountries[],
    history: Api.CovidHistory,
  ): void => {
    const input: any = this.parent.querySelector(this.searchAttr);

    input!.addEventListener('keyup', () => {
      const { value } = input;
      const dataCases = this.search(value, countries);
      const dataStats = this.search(value, countries);

      casesTable.fillTable(dataCases);

      if (value) {
        statsTable.fillTableFiltered(dataStats, value);
      } else {
        chart.updateChart();
        statsTable.fillTableDefault(summary, history);
      }

      this.addClickEvtToTable(summary, countries, history);
    });
  };

  public initSearch = (summary: Api.CovidSummary, countries: Api.CovidCountries[], history: Api.CovidHistory): void => {
    this.addClickEvtToTable(summary, countries, history);
    this.addKeyupEvtToInput(summary, countries, history);
    this.addClickEvtToClearBtn(summary, countries, history);
  };
}
