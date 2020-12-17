import '../styles/style.scss';
import prettifyNumber from './helpers/pretiffy.number.helper';
import ApiData from './data/api.data';
import API_REQUESTS from './constants/api.requests.const';
import DOM from './constants/dom.const';
import GlobalCasesComponent from './components/cases.global.component';
import DateComponent from './components/date.component';
import CountriesCountComponent from './components/countries.count.component';
import CasesTableComponent from './components/cases.table.component';

const init = async (): Promise<void> => {
  const data = new ApiData();
  const globalCases = new GlobalCasesComponent(DOM.htmlElements.cases!, DOM.strings.casesGlobalAttr);
  const date = new DateComponent(DOM.htmlElements.cases!, DOM.strings.dateAttr);
  const countriesCount = new CountriesCountComponent(DOM.htmlElements.world!, DOM.strings.countriesCountAttr);
  const casesTable = new CasesTableComponent(DOM.htmlElements.cases!);

  const covidInfo = await data.getCovidInfo(API_REQUESTS.covid.summary);
  const countriesInfo = await data.getCountriesInfo(API_REQUESTS.countries);

  date.setDate(covidInfo.Date);
  globalCases.setCases(prettifyNumber(covidInfo.Global.TotalConfirmed));
  countriesCount.setCountriesCount(covidInfo.Countries.length.toString());
  casesTable.fillTable(covidInfo.Countries);

  console.log(covidInfo);
};

init();
