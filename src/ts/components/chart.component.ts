import Chart, { ChartConfiguration } from 'chart.js';
import { dataApi } from '../index';
import { CovidCountries } from '../data/api.data';
import calc100kRate from '../helpers/calc.rate.per100k.helper';
import getLastData from '../helpers/get.last.day.data.helper';

interface ChartCfg {
  lastUpdType?: string;
  readonly cases?: string;
  readonly deaths?: string;
  readonly recovered?: string;
  dataArray?: number[];
  labelsArray?: string[];
  color?: string;
  country?: string;
  chartType?: string;
}

export default class ChartComponent {
  private parent: HTMLElement;

  private chartAttr: string;

  private listAttr: string;

  private chartContainer!: HTMLCanvasElement | null;

  private chartCtx!: any;

  public chart!: Chart;

  public casesForCountry!: number[];

  public deathsForCountry!: number[];

  public recoveredForCountry!: number[];

  private chartDefaultCfg: ChartConfiguration = {
    type: 'line',
    data: {
      datasets: [
        {
          backgroundColor: '#bb86fc',
          pointBackgroundColor: '#bb86fc',
          borderWidth: 0,
          hoverBorderWidth: 0,
          hoverBorderColor: '#fff',
          fill: false,
          lineTension: 0,
          pointRadius: 4,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
      },
      legend: {
        display: false,
        labels: {
          fontColor: '#fff',
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              callback: (value: number) => {
                if (value >= 1000000) {
                  return `${value / 10e5}M`;
                }
                return `${value / 10e2}K`;
              },
              fontColor: '#ddd',
              fontSize: 14,
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'month',
            },
            ticks: {
              fontColor: '#ddd',
              fontSize: 14,
              beginAtZero: true,
            },
          },
        ],
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
    },
  };

  private chartType: ChartCfg = {
    lastUpdType: 'cases',
    country: '',
    cases: 'cases',
    deaths: 'deaths',
    recovered: 'recovered',
    chartType: 'line',
  };

  private chartParamUpd: ChartCfg = {
    dataArray: [],
    labelsArray: [],
    color: '',
  };

  constructor(parent: HTMLElement, chartAttr: string, listAttr: string) {
    this.parent = parent;
    this.chartAttr = chartAttr;
    this.listAttr = listAttr;
  }

  public initChart = (): void => {
    const component: string = `<div class="stats__chart">
                                <select class="stats__select" ${this.listAttr.slice(1, -1)}>
                                  <option class="stats__option" id="${this.chartType.cases}" selected>Cases</option>
                                  <option class="stats__option" id="${this.chartType.deaths}">Deaths</option>
                                  <option class="stats__option" id="${this.chartType.recovered}">Recovered</option>
                                </select>
                                <canvas  ${this.chartAttr.slice(1, -1)}> </canvas>
                              </div>`;

    this.parent?.insertAdjacentHTML('beforeend', component);
    this.chartContainer = document.querySelector(this.chartAttr);
    this.chartCtx = this.chartContainer?.getContext('2d');

    Chart.defaults.global.defaultFontFamily = 'Heebo, sans-serif';
    Chart.defaults.global.defaultFontSize = 14;

    this.chart = new Chart(this.chartCtx, this.chartDefaultCfg);

    this.initChartSelecting();
    this.updateChart();
    document.addEventListener('changedata', () => this.updateChart(this.chartType.country));
  };

  private setRate = async (dataObject: any, countries: CovidCountries[]): Promise<number[]> => {
    const rate = window.localStorage.getItem('rate');
    const dataArray: any[] = [];

    if (rate === 'ABS') {
      dataArray.push(...Object.values(dataObject));
    } else if (this.chartType.country) {
      const countryPopulation = countries.filter((obj) => obj.country === this.chartType.country)[0].population;
      dataArray.push(...Object.values(dataObject).map((num: any) => calc100kRate(num, countryPopulation)));
    } else {
      const worldPopulation = (await dataApi.getCovidSummary()).population;
      dataArray.push(
        ...Object.values(dataObject).map((num: any) => Math.ceil((num * 10e5) / worldPopulation / 10 || 0)),
      );
    }

    return dataArray;
  };

  private setPeriodAndChartType = (dataObject: any) => {
    const period = window.localStorage.getItem('period');
    this.chartParamUpd.labelsArray = Object.keys(dataObject);

    if (period === 'LAST') {
      const lastTwoDataItems: number[] = [getLastData(this.chartParamUpd.dataArray!)];
      const lastLabelItem: string = this.chartParamUpd.labelsArray![this.chartParamUpd.labelsArray!.length - 1];

      this.chartParamUpd.dataArray = [lastTwoDataItems.reduce((prev, next) => next - prev, 0)];
      this.chartParamUpd.labelsArray = [lastLabelItem];
      this.chartParamUpd.chartType = 'bar';
    } else {
      this.chartParamUpd.chartType = 'line';
    }
  };

  private updateParam = async (dataObject: any, color: string) => {
    const countries = await dataApi.getCovidCountries();

    this.chartParamUpd.dataArray = await this.setRate(dataObject, countries);
    this.setPeriodAndChartType(dataObject);
    this.chartParamUpd.color = color;
  };

  private applyNewParam = () => {
    this.chart.config.type = this.chartParamUpd.chartType;
    this.chart.data.labels = this.chartParamUpd.labelsArray;

    this.chart.data.datasets = [
      {
        data: this.chartParamUpd.dataArray,
        backgroundColor: this.chartParamUpd.color,
        pointBackgroundColor: this.chartParamUpd.color,
        fill: false,
        hoverBorderColor: '#fff',
        borderWidth: 0,
        hoverBorderWidth: 0,
        lineTension: 0,
        pointRadius: 4,
        pointHoverRadius: 8,
      },
    ];
  };

  private initChartSelecting = (): void => {
    const list: HTMLSelectElement | null = document.querySelector(this.listAttr);

    list?.addEventListener('change', () => {
      const { id } = list.options[list.selectedIndex];
      list.blur();
      this.chartType.lastUpdType = id;
      this.updateChart(this.chartType.country);
    });
  };

  public updateChart = async (country?: string): Promise<void> => {
    this.chartType.country = country;

    switch (this.chartType.lastUpdType) {
      case this.chartType.cases:
        await this.updateParam(await dataApi.getCountryHistoryCases(country), '#bb86fc');
        break;

      case this.chartType.deaths:
        await this.updateParam(await dataApi.getCountryHistoryDeaths(country), '#ff3d47');
        break;

      case this.chartType.recovered:
        await this.updateParam(await dataApi.getCountryHistoryRecovered(country), '#03dac6');
        break;
      default:
        throw new Error('Wrong chart type');
    }

    this.applyNewParam();
    this.chart.update();
  };
}
