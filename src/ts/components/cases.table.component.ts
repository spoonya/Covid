import TableComponent from './table.component';
import * as Covid from '../data/api.data';

export default class CasesTableComponent {
  private parent!: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createDataArray = (covidCountries: Covid.CovidCountries[]): Array<any> => {
    const countriesLength = covidCountries.length;
    const newArray: any[][] = [];

    for (let i = 0; i < countriesLength; i++) {
      const flagImg = `<img src="${covidCountries[i].countryInfo.flag}" alt="Flag of ${covidCountries[i].country}">`;
      newArray[i] = [flagImg, covidCountries[i].country, covidCountries[i].cases];
    }

    return newArray;
  };

  public fillTable = (covidInfo: Covid.CovidCountries[]): void => {
    const covidCountries = covidInfo.slice().sort((a, b) => b.cases - a.cases);
    const dataArray = this.createDataArray(covidCountries);

    new TableComponent(dataArray).render(this.parent);
  };
}
