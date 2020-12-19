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

const init = async (): Promise<void> => {
  const data = new ApiData();
  const globalCases = new GlobalCasesComponent(DOM.htmlElements.cases!, DOM.attributes.casesGlobal);
  const date = new DateComponent(DOM.htmlElements.cases!, DOM.attributes.date);
  const countriesCount = new CountriesCountComponent(DOM.htmlElements.world!, DOM.attributes.countriesCount);
  const casesTable = new CasesTableComponent(DOM.htmlElements.casesTable!);
  const statsTable = new StatsTableComponent(DOM.htmlElements.statsTable!);
  const chart = new ChartComponent(DOM.htmlElements.stats!, DOM.attributes.chart);

  const covidInfo = await data.getCovidInfo(API_REQUESTS.covid.summary);
  const covidHistory = await data.getCovidHistory(API_REQUESTS.covid.history);
  const countriesInfo = await data.getCountriesInfo(API_REQUESTS.countries);

  date.setDate(covidInfo.Date);
  globalCases.setCases(prettifyNumber(covidInfo.Global.TotalConfirmed));
  countriesCount.setCountriesCount(covidInfo.Countries.length.toString());
  casesTable.fillTable(covidInfo, countriesInfo);
  statsTable.fillTable(covidInfo, countriesInfo);
  chart.initChart(Object.values(covidHistory.cases), Object.keys(covidHistory.cases));
};

init();
