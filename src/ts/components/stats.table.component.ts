import TableComponent from './table.component';
import { CovidInfo, CountriesInfo, CovidCountries, CovidInfoGlobal } from '../data/api.data';

export default class StatsTableComponent {
  private parent!: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createGlobalDataArray = (covidObject: CovidInfoGlobal): any[][] => {
    return [['Global', covidObject.TotalConfirmed, covidObject.TotalDeaths, covidObject.TotalRecovered]];
  };

  public fillTable = (covidInfo: CovidInfo, countriesInfo: CountriesInfo[]): void => {
    const covidCountries = covidInfo.Global;
    const dataArray = this.createGlobalDataArray(covidCountries);

    new TableComponent(dataArray, ['Country', 'Cases', 'Deaths', 'Recovered']).render(this.parent);
  };
}
