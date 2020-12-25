export interface CovidHistory {
  readonly cases: {};
  readonly deaths: {};
  readonly recovered: {};
}

export interface CovidCountryHistory {
  readonly country: string;
  readonly timeline: CovidHistory;
}

export interface CovidSummary {
  readonly updated: Date;
  readonly cases: number;
  readonly todayCases: number;
  readonly deaths: number;
  readonly todayDeaths: number;
  readonly recovered: number;
  readonly todayRecovered: number;
  readonly active: number;
  readonly critical: number;
  readonly casesPerOneMillion: number;
  readonly deathsPerOneMillion: number;
  readonly tests: number;
  readonly testsPerOneMillion: number;
  readonly population: number;
  readonly oneCasePerPeople: number;
  readonly oneDeathPerPeople: number;
  readonly oneTestPerPeople: number;
  readonly activePerOneMillion: number;
  readonly recoveredPerOneMillion: number;
  readonly criticalPerOneMillion: number;
  readonly affectedCountries: number;
}

export interface CountryInfo {
  readonly _id: number;
  readonly iso3: string;
  readonly iso2: string;
  readonly lat: number;
  readonly long: number;
  readonly flag: string;
}

export interface CovidCountries {
  readonly updated: Date;
  readonly country: string;
  readonly countryInfo: CountryInfo;
  readonly cases: number;
  readonly todayCases: number;
  readonly deaths: number;
  readonly todayDeaths: number;
  recovered: number | string;
  readonly todayRecovered: number;
  readonly active: number;
  readonly critical: number;
  readonly casesPerOneMillion: number;
  readonly deathsPerOneMillion: number;
  readonly tests: number;
  readonly testsPerOneMillion: number;
  readonly population: number;
  readonly continent: string;
  readonly oneCasePerPeople: number;
  readonly oneDeathPerPeople: number;
  readonly oneTestPerPeople: number;
  readonly activePerOneMillion: number;
  readonly recoveredPerOneMillion: number;
  readonly criticalPerOneMillion: number;
}

interface StorageData {
  data: object;
  timestamp: number;
}

export class ApiData {
  private responseCacheTime: number = 60 * 5; // 5 minutes

  private checkStorage(key: string): boolean {
    const res = window.localStorage.getItem(key);

    if (!res) return false;

    const storageData: StorageData = JSON.parse(res);
    const currentDate = new Date().getTime();
    const timespan = Math.floor((currentDate - new Date(storageData.timestamp).getTime()) / 1000);

    if (timespan > this.responseCacheTime) return false;

    return true;
  }

  private saveToStorage = (key: string, data: any): void => {
    const timestamp = new Date().getTime();
    const dataToSave = { data, timestamp };
    window.localStorage.setItem(key, JSON.stringify(dataToSave));
  };

  private loadFromStorage = (key: string): object => {
    const storageData: StorageData = JSON.parse(window.localStorage.getItem(key)!);
    if (!storageData) return {};
    return storageData.data;
  };

  private async fetchUrl(storageKey: string, url: string): Promise<void> {
    try {
      const res = await fetch(url);
      const data = await res.json();

      this.saveToStorage(storageKey, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  public getCovidCountries = async (): Promise<CovidCountries[]> => {
    if (!this.checkStorage('countries')) await this.fetchUrl('countries', 'https://disease.sh/v3/covid-19/countries');
    return this.loadFromStorage('countries') as CovidCountries[];
  };

  public getCovidSummary = async (): Promise<CovidSummary> => {
    if (!this.checkStorage('summary')) await this.fetchUrl('summary', 'https://disease.sh/v3/covid-19/all');
    return this.loadFromStorage('summary') as CovidSummary;
  };

  public getCovidHistory = async (): Promise<CovidHistory> => {
    if (!this.checkStorage('history'))
      await this.fetchUrl('history', 'https://disease.sh/v3/covid-19/historical/all?lastdays=366');
    return this.loadFromStorage('history') as CovidHistory;
  };

  public getCovidCountryHistory = async (country: string): Promise<CovidCountryHistory> => {
    if (!this.checkStorage(`history-${country}`))
      await this.fetchUrl(`history-${country}`, `https://disease.sh/v3/covid-19/historical/${country}?lastdays=366`);
    return this.loadFromStorage(`history-${country}`) as CovidCountryHistory;
  };

  public getCountryHistoryCases = async (country?: string): Promise<any> => {
    const dataObject: any = country
      ? (await this.getCovidCountryHistory(country)).timeline.cases
      : (await this.getCovidHistory()).cases;

    return dataObject;
  };

  public getCountryHistoryDeaths = async (country?: string): Promise<any> => {
    const dataObject: any = country
      ? (await this.getCovidCountryHistory(country)).timeline.deaths
      : (await this.getCovidHistory()).deaths;

    return dataObject;
  };

  public getCountryHistoryRecovered = async (country?: string): Promise<any> => {
    const dataObject: any = country
      ? (await this.getCovidCountryHistory(country)).timeline.recovered
      : (await this.getCovidHistory()).recovered;

    return dataObject;
  };
}
