import TableComponent from './table.component';
import * as Api from '../data/api.data';
import calc100kRate from '../helpers/calc.rate.per100k.helper';
import getLastData from '../helpers/get.last.day.data.helper';
import { dataApi } from '../index';

export default class StatsTableComponent {
  private parent!: HTMLElement;

  private header: string[] = ['Country', 'Cases', 'Deaths', 'Recovered'];

  private rowIdIndex: number = 0;

  private country: string | null = null;

  private covidSummary!: Api.CovidSummary;

  private covidHistory!: Api.CovidHistory;

  private covidCountries!: Api.CovidCountries[] | null;

  constructor(parent: HTMLElement) {
    this.parent = parent;

    document.addEventListener('changedata', () => this.updateTable());
  }

  private isAbsoluteRate = (): boolean => {
    const rate = window.localStorage.getItem('rate');

    return rate === 'ABS';
  };

  private isAllPeriod = (): boolean => {
    const rate = window.localStorage.getItem('period');

    return rate === 'ALL';
  };

  private updateTable = (): void => {
    if (!this.country) {
      this.fillTableDefault(this.covidSummary, this.covidHistory);
    } else {
      this.fillTableFiltered(this.covidCountries!, this.country);
    }
  };

  private isNoData = (value: number | string): string | number => {
    if (value === 0) {
      return 'No data';
    }
    return value;
  };

  private createDefaultData = async (summary: Api.CovidSummary, history: Api.CovidHistory): Promise<any[][]> => {
    const summaryCopy = { ...summary };

    if (!this.isAllPeriod()) {
      summaryCopy.cases = getLastData(Object.values(history.cases));
      summaryCopy.deaths = getLastData(Object.values(history.deaths));
      summaryCopy.recovered = getLastData(Object.values(history.recovered));
    }

    if (this.isAbsoluteRate()) {
      return [['Global', summaryCopy.cases, summaryCopy.deaths, summaryCopy.recovered]];
    }

    const worldPopulation = summaryCopy.population;

    return [
      [
        'Global',
        calc100kRate(summaryCopy.cases, worldPopulation),
        calc100kRate(summaryCopy.deaths, worldPopulation),
        calc100kRate(summaryCopy.recovered, worldPopulation),
      ],
    ];
  };

  private createFilteredData = async (countries: Api.CovidCountries[]): Promise<any[][]> => {
    const countriesCopy = countries.slice();
    const covidArrayLength = countries.length;
    const newArray: any[][] = [];

    const dataObject = (await dataApi.getCovidCountryHistory(this.country!)).timeline;

    if (!this.isAllPeriod()) {
      for (let i = 0; i < covidArrayLength; i++) {
        newArray[i] = [
          countriesCopy[i].country,
          getLastData(Object.values(dataObject.cases)),
          getLastData(Object.values(dataObject.deaths)),
          this.isNoData(getLastData(Object.values(dataObject.recovered))),
        ];
      }
    } else {
      for (let i = 0; i < covidArrayLength; i++) {
        newArray[i] = [
          countriesCopy[i].country,
          countriesCopy[i].cases,
          countriesCopy[i].deaths,
          this.isNoData(countriesCopy[i].recovered),
        ];
      }
    }

    if (!this.isAbsoluteRate()) {
      return newArray.map((subarray) => {
        return subarray.map((el) => {
          const { population } = countries.filter((obj) => obj.country === subarray[0])[0];
          if (typeof el !== 'string') return calc100kRate(el, population);
          return el;
        });
      });
    }

    return newArray;
  };

  public fillTableDefault = async (summary: Api.CovidSummary, history: Api.CovidHistory): Promise<void> => {
    if (!this.covidHistory) this.covidHistory = history;
    if (!this.covidSummary) this.covidSummary = summary;
    this.country = null;

    const data = await this.createDefaultData(summary, history);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };

  public fillTableFiltered = async (countries: Api.CovidCountries[], country: string): Promise<void> => {
    this.covidCountries = countries;
    this.country = country;

    const data = await this.createFilteredData(countries);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };
}
