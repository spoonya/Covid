import '../styles/style.scss';
import prettifyNumber from './helpers/pretiffy.number.helper';
import { ApiData } from './data/api.data';
import API_REQUESTS from './constants/api.requests.const';
import DOM from './constants/dom.const';
import GlobalCasesComponent from './components/cases.global.component';
import DateComponent from './components/date.component';
import CountriesCountComponent from './components/countries.count.component';
import CasesTableComponent from './components/cases.table.component';
import StatsTableComponent from './components/stats.table.component';
import ChartComponent from './components/chart.component';
import Map from './components/map.component';

const init = async (): Promise<void> => {
  const data = new ApiData();
  const globalCases = new GlobalCasesComponent(DOM.htmlElements.cases!, DOM.attributes.casesGlobal);
  const date = new DateComponent(DOM.htmlElements.cases!, DOM.attributes.date);
  const countriesCount = new CountriesCountComponent(DOM.htmlElements.world!, DOM.attributes.countriesCount);
  const casesTable = new CasesTableComponent(DOM.htmlElements.casesTable!);
  const statsTable = new StatsTableComponent(DOM.htmlElements.statsTable!);
  const chart = new ChartComponent(DOM.htmlElements.stats!, DOM.attributes.chart);
  const map = new Map(DOM.htmlElements.map!);

  const covidSummary = await data.getCovidSummary(API_REQUESTS.summary);
  const covidCountries = await data.getCovidCountries(API_REQUESTS.countries);
  const covidHistory = await data.getCovidHistory(API_REQUESTS.history);

  date.setDate(covidSummary.updated);
  globalCases.setCases(prettifyNumber(covidSummary.cases));
  countriesCount.setCountriesCount(covidSummary.affectedCountries);
  casesTable.fillTable(covidCountries);
  statsTable.fillTable(covidSummary);
  chart.initChart(Object.values(covidHistory.cases), Object.keys(covidHistory.cases));
  map.init();
};

init();
