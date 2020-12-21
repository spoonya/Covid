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

export class ApiData {
  public getCovidCountries = async (): Promise<CovidCountries[]> => {
    try {
      const res = await fetch('https://disease.sh/v3/covid-19/countries');
      const data: CovidCountries[] = await res.json();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  public getCovidSummary = async (): Promise<CovidSummary> => {
    try {
      const res = await fetch('https://disease.sh/v3/covid-19/all');
      const data: CovidSummary = await res.json();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  public getCovidHistory = async (): Promise<CovidHistory> => {
    try {
      const res = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
      const data: CovidHistory = await res.json();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  public getCovidCountryHistory = async (country: string): Promise<CovidCountryHistory> => {
    try {
      const res = await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=366`);
      const data: CovidCountryHistory = await res.json();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };
}
