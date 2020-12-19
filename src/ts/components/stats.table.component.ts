import TableComponent from './table.component';
import * as Covid from '../data/api.data';

export default class StatsTableComponent {
  private parent!: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createGlobalDataArray = (covidObject: Covid.CovidSummary): any[][] => {
    return [['Global', covidObject.cases, covidObject.deaths, covidObject.recovered]];
  };

  public fillTable = (covidInfo: Covid.CovidSummary): void => {
    const covidCountries = covidInfo;
    const dataArray = this.createGlobalDataArray(covidCountries);

    new TableComponent(dataArray, ['Country', 'Cases', 'Deaths', 'Recovered']).render(this.parent);
  };
}
