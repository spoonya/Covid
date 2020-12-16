interface CountriesInfo {
  readonly flag: string;
  readonly name: string;
  readonly alpha2Code: string;
  readonly population: number;
}

interface CovidInfo {
  readonly Message: string;
  readonly Date: Date;
  readonly Countries: [
    {
      readonly Country: string;
      readonly CountryCode: string;
      readonly Date: Date;
      readonly NewConfirmed: number;
      readonly NewDeaths: number;
      readonly NewRecovered: number;
      readonly Slug: string;
      readonly TotalConfirmed: number;
      readonly TotalDeaths: number;
      readonly TotalRecovered: number;
    },
  ];
  readonly Global: {
    readonly NewConfirmed: number;
    readonly NewDeaths: number;
    readonly NewRecovered: number;
    readonly TotalConfirmed: number;
    readonly TotalDeaths: number;
    readonly TotalRecovered: number;
  };
}

export default class ApiData {
  public getCountriesInfo = async (url: string): Promise<CountriesInfo[]> => {
    try {
      const res = await fetch(url);
      const data: CountriesInfo[] = await res.json();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  public getCovidInfo = async (url: string): Promise<CovidInfo> => {
    try {
      const res = await fetch(url);
      const data: CovidInfo = await res.json();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };
}
