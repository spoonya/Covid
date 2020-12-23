import TableComponent from './table.component';
import * as Api from '../data/api.data';

const ApiData = new Api.ApiData();

export default class StatsTableComponent {
  private parent!: HTMLElement;

  private header: string[] = ['Country', 'Cases', 'Deaths', 'Recovered'];

  private rowIdIndex: number = 0;

  public currentItem: string = 'Global';

  constructor(parent: HTMLElement) {
    this.parent = parent;

    document.addEventListener('changedata', this.update.bind(this));
  }

  private createDefaultAllData = (covidObject: Api.CovidSummary): any[][] => {
    return [['Global', covidObject.cases, covidObject.deaths, covidObject.recovered]];
  };

  private createDefaultLastData = (covidObject: Api.CovidSummary): any[][] => {
    return [['Global', covidObject.todayCases, covidObject.todayDeaths, covidObject.todayRecovered]];
  };

  private createFilteredDataAll = (countries: Api.CovidCountries[]): any[][] => {
    this.currentItem = countries[0].country;

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

  private async getData(): Promise<any[][]> {
    const { currentItem } = this;
    const summary = await ApiData.getCovidSummary();

    if (currentItem === 'Global') return this.createDefaultAllData(summary);

    const rate = window.localStorage.getItem('rate');
    const period = window.localStorage.getItem('period');

    const data = (await ApiData.getCovidCountries()).filter((item) => item.country === this.currentItem)[0];

    const res: [(string | number)[]] = [['', 0, 0, 0]];

    res[0][1] = period === 'ALL' ? data.cases : data.todayCases;
    res[0][2] = period === 'ALL' ? data.deaths : data.todayDeaths;
    res[0][3] = period === 'ALL' ? data.recovered || 'No data' : data.todayRecovered;

    if (rate === '100K')
      res[0] = res[0].map((value) => {
        const newValue = 0;
        if (data.population === 0) return newValue;
        return Math.ceil(((value as number) * 10e5) / data.population) / 10;
      });

    res[0][0] = data.country;

    return res;
  }

  async update() {
    new TableComponent(await this.getData(), this.rowIdIndex, this.header).render(this.parent);
  }

  public fillTableDefaultAll = (summary: Api.CovidSummary): void => {
    const data = this.createDefaultAllData(summary);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };

  public fillTableDefaultLast = (summary: Api.CovidSummary): void => {
    const data = this.createDefaultLastData(summary);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };

  public fillTableFilteredAll = (countries: Api.CovidCountries[]): void => {
    const data = this.createFilteredDataAll(countries);

    new TableComponent(data, this.rowIdIndex, this.header).render(this.parent);
  };
}
