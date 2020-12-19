interface CovidApiRequests {
  readonly summary: string;
  readonly history: string;
}

const API_REQUESTS: { readonly countries: string; covid: CovidApiRequests } = {
  countries: 'https://restcountries.eu/rest/v2/all?fields=population;flag;alpha2Code',
  covid: {
    summary: 'https://api.covid19api.com/summary',
    history: 'https://disease.sh/v3/covid-19/historical/all?lastdays=366',
  },
};

export default API_REQUESTS;
