import TableComponent from './table.component';
import { CovidInfo, CountriesInfo, CovidCountries } from '../data/api.data';

export default class CasesTableComponent {
  private parent!: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  private createDataArray = (covidArray: CovidCountries[], countriesArray: CountriesInfo[]): Array<any> => {
    const countriesLength = covidArray.length;
    const newArray: any[][] = [];

    for (let i = 0; i < countriesLength; i++) {
      newArray[i] = [];
      const flagSrc = countriesArray.find((el) => el.alpha2Code === covidArray[i].CountryCode)?.flag;
      const flagImg = `<img src="${flagSrc}" alt="Flag of ${covidArray[i].Country}">`;

      newArray[i].push(flagImg, covidArray[i].Country, covidArray[i].TotalConfirmed);
    }

    return newArray;
  };

  public fillTable = (covidInfo: CovidInfo, countriesInfo: CountriesInfo[]): void => {
    const covidCountries = covidInfo.Countries.slice().sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
    const dataArray = this.createDataArray(covidCountries, countriesInfo);

    new TableComponent(dataArray).render(this.parent);
  };
}
