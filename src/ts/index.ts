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

const data = new ApiData();
const search = new SearchComponent(DOM.htmlElements.cases!, DOM.attributes.search);
const date = new DateComponent(DOM.htmlElements.cases!, DOM.attributes.date);
const countriesCount = new CountriesCountComponent(DOM.htmlElements.world!, DOM.attributes.countriesCount);
const casesTable = new CasesTableComponent(DOM.htmlElements.casesTable!);
const statsTable = new StatsTableComponent(DOM.htmlElements.statsTable!);
const chart = new ChartComponent(DOM.htmlElements.stats!, DOM.attributes.chart, DOM.attributes.chartList!);
const map = new Map(DOM.htmlElements.map!);
const rateSwitch = new RateSwitch(DOM.htmlElements.switches!);
const periodSwitch = new PeriodSwitch(DOM.htmlElements.switches!);

export { casesTable, statsTable, chart, data };

const init = async (): Promise<void> => {
  const covidSummary = await data.getCovidSummary();
  const covidCountries = await data.getCovidCountries();
  const covidHistory = await data.getCovidHistory();

  date.setDate(covidSummary.updated);
  countriesCount.setCountriesCount(covidSummary.affectedCountries);
  casesTable.fillTable(covidCountries);
  statsTable.fillTableDefaultAll(covidSummary);
  chart.initChart(Object.values(covidHistory.cases), Object.keys(covidHistory.cases));
  search.initSearch(covidSummary, covidCountries);
  map.init();

  document.addEventListener('changedata', () => {
    if (localStorage.getItem('period') === 'ALL') {
      statsTable.fillTableDefaultAll(covidSummary);
    } else {
      statsTable.fillTableDefaultLast(covidSummary);
    }
  });
};

init();
