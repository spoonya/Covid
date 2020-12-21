import TableComponent from './table.component';
import * as Api from '../data/api.data';

export default class StatsTableComponent {
  private parent!: HTMLElement;

  private header: string[] = ['Country', 'Cases', 'Deaths', 'Recovered'];

  private rowIdIndex: number = 0;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createDefaultDataArray = (covidObject: Api.CovidSummary): any[][] => {
    return [['Global', covidObject.cases, covidObject.deaths, covidObject.recovered]];
  };

  private createFilteredDataArray = (countries: Api.CovidCountries[]): any[][] => {
    const countriesCopy = countries.slice();
    const covidArrayLength = countries.length;
    const newArray: any[][] = [];

    for (let i = 0; i < covidArrayLength; i++) {
      if (countriesCopy[i].recovered === 0) {
        countriesCopy[i].recovered = 'No data';
      }

      newArray[i] = [
        countriesCopy[i].country,
        countriesCopy[i].cases,
        countriesCopy[i].deaths,
        countriesCopy[i].recovered,
      ];
    }

    return newArray;
  };

  public fillTableDefault = (summary: Api.CovidSummary): void => {
    const data = this.createDefaultDataArray(summary);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };

  public fillTableFiltered = (countries: Api.CovidCountries[]): void => {
    const data = this.createFilteredDataArray(countries);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };
}
