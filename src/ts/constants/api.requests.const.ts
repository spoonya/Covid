interface CovidApiRequests {
  readonly summary: string;
  readonly history: string;
  readonly countries: string;
}

const API_REQUESTS: CovidApiRequests = {
  summary: 'https://disease.sh/v3/covid-19/all',
  countries: 'https://disease.sh/v3/covid-19/countries',
  history: 'https://disease.sh/v3/covid-19/historical/all?lastdays=366',
};

export default API_REQUESTS;
