interface CovidApiRequests {
  readonly summary: string;
}

const API_REQUESTS: { countries: string; covid: CovidApiRequests } = {
  countries: 'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code',
  covid: {
    summary: 'https://api.covid19api.com/summary',
  },
};

export default API_REQUESTS;
