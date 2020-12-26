/* eslint-disable no-new */
import '../styles/style.scss';
import { ApiData } from './data/api.data';
import DOM from './constants/dom.const';
import SearchComponent from './components/search.component';
import DateComponent from './components/date.component';
import CountriesCountComponent from './components/countries.count.component';
import CasesTableComponent from './components/cases.table.component';
import StatsTableComponent from './components/stats.table.component';
import ChartComponent from './components/chart.component';
import Map from './components/map.component';
import RateSwitch from './components/rate.switch.component';
import PeriodSwitch from './components/period.switch.component';

const dataApi = new ApiData();
new RateSwitch(DOM.htmlElements.switches!);
new PeriodSwitch(DOM.htmlElements.switches!);
const search = new SearchComponent(DOM.htmlElements.cases!, DOM.attributes.search);
const date = new DateComponent(DOM.htmlElements.cases!, DOM.attributes.date);
const countriesCount = new CountriesCountComponent(DOM.htmlElements.world!, DOM.attributes.countriesCount);
const casesTable = new CasesTableComponent(DOM.htmlElements.casesTable!);
const statsTable = new StatsTableComponent(DOM.htmlElements.statsTable!);
const chart = new ChartComponent(DOM.htmlElements.stats!, DOM.attributes.chart, DOM.attributes.chartList!);
const map = new Map(DOM.htmlElements.map!);

export { casesTable, statsTable, chart, dataApi };

const init = async (): Promise<void> => {
  const covidSummary = await dataApi.getCovidSummary();
  const covidCountries = await dataApi.getCovidCountries();
  const covidHistory = await dataApi.getCovidHistory();

  date.setDate(covidSummary.updated);
  countriesCount.setCountriesCount(covidSummary.affectedCountries);
  casesTable.fillTable(covidCountries);
  statsTable.fillTableDefault(covidSummary, covidHistory);
  chart.initChart();
  search.initSearch(covidSummary, covidCountries, covidHistory);
  await map.init();
};

init();
