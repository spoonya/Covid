import TableComponent from './table.component';
import * as Api from '../data/api.data';

export default class StatsTableComponent {
  private parent!: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createDefaultDataArray = (covidObject: Api.CovidSummary): any[][] => {
    return [['Global', covidObject.cases, covidObject.deaths, covidObject.recovered]];
  };

  private createFilteredDataArray = (covidCountries: Api.CovidCountries[]): any[][] => {
    const countriesLength = covidCountries.length;
    const newArray: any[][] = [];

    for (let i = 0; i < countriesLength; i++) {
      newArray[i] = [
        covidCountries[i].country,
        covidCountries[i].cases,
        covidCountries[i].deaths,
        covidCountries[i].recovered,
      ];
    }

    return newArray;
  };

  public fillTableDefault = (summary: Api.CovidSummary): void => {
    const data = this.createDefaultDataArray(summary);

    new TableComponent(data, ['Country', 'Cases', 'Deaths', 'Recovered']).render(this.parent);
  };

  public fillTableFiltered = (countries: Api.CovidCountries[]): void => {
    const data = this.createFilteredDataArray(countries);

    new TableComponent(data, ['Country', 'Cases', 'Deaths', 'Recovered']).render(this.parent);
  };
}
