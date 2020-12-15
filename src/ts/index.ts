import '../styles/style.scss';
import ApiData from './data/api.data';
import API_REQUESTS from './constants/api.requests.const';

const api: ApiData = new ApiData();

const init = async () => {
  const covid = await api.getCovidInfo(API_REQUESTS.covid.summary);
  const countries = await api.getCountriesInfo(API_REQUESTS.countries);

  console.log(covid.Global);
  console.log(countries);
};

init();
