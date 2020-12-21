import TableComponent from './table.component';
import * as Api from '../data/api.data';

export default class CasesTableComponent {
  private parent!: HTMLElement;

  private rowIdIndex: number = 1;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createDataArray = (covidCountries: Api.CovidCountries[]): any[][] => {
    const countriesLength = covidCountries.length;
    const newArray: any[][] = [];

    for (let i = 0; i < countriesLength; i++) {
      const flagImg = `<img src="${covidCountries[i].countryInfo.flag}" alt="Flag of ${covidCountries[i].country}">`;
      newArray[i] = [flagImg, covidCountries[i].country, covidCountries[i].cases];
    }

    return newArray;
  };

  public fillTable = (covidInfo: Api.CovidCountries[]): void => {
    const covidCountries = covidInfo.slice().sort((a, b) => b.cases - a.cases);
    const dataArray = this.createDataArray(covidCountries);

    new TableComponent(dataArray, this.rowIdIndex).render(this.parent);
  };
}
