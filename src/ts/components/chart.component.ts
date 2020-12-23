import Chart from 'chart.js';
import { data } from '../index';

interface ChartCfg {
  lastUpdType?: string;
  readonly cases?: string;
  readonly deaths?: string;
  readonly recovered?: string;
  dataArray?: number[];
  color?: string;
  country?: string;
}

export default class ChartComponent {
  private parent: HTMLElement;

  private chartAttr: string;

  private listAttr: string;

  private chartContainer!: HTMLCanvasElement | null;

  private chartCtx!: any;

  public chart!: Chart;

  private chartType: ChartCfg = {
    lastUpdType: 'cases',
    country: '',
    cases: 'cases',
    deaths: 'deaths',
    recovered: 'recovered',
  };

  private chartParamUpd: ChartCfg = {
    dataArray: [],
    color: '',
  };

  constructor(parent: HTMLElement, chartAttr: string, listAttr: string) {
    this.parent = parent;
    this.chartAttr = chartAttr;
    this.listAttr = listAttr;
  }

  public initChart = (dataArray: any[], labelsArray: any[]): void => {
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
    this.initChartSelecting();
    this.chartCtx = this.chartContainer?.getContext('2d');

    Chart.defaults.global.defaultFontFamily = 'Heebo, sans-serif';
    Chart.defaults.global.defaultFontSize = 14;

    this.chart = new Chart(this.chartCtx, {
      type: 'line',
      data: {
        labels: labelsArray,
        datasets: [
          {
            data: dataArray,
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
                fontColor: '#bcbcbc',
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
                fontColor: '#bcbcbc',
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
    });
  };

  private getDeaths = async (country?: string): Promise<number[]> => {
    const dataObject: any = country
      ? (await data.getCovidCountryHistory(country)).timeline.deaths
      : (await data.getCovidHistory()).deaths;

    return Object.values(dataObject);
  };

  private getCases = async (country?: string): Promise<number[]> => {
    const dataObject: any = country
      ? (await data.getCovidCountryHistory(country)).timeline.cases
      : (await data.getCovidHistory()).cases;

    return Object.values(dataObject);
  };

  private getRecovered = async (country?: string): Promise<number[]> => {
    const dataObject: any = country
      ? (await data.getCovidCountryHistory(country)).timeline.recovered
      : (await data.getCovidHistory()).recovered;

    return Object.values(dataObject);
  };

  private updateParam = (array: number[], color: string) => {
    this.chartParamUpd.dataArray = array;
    this.chartParamUpd.color = color;
  };

  private applyNewParam = () => {
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
        this.updateParam(await this.getCases(country), '#bb86fc');
        break;

      case this.chartType.deaths:
        this.updateParam(await this.getDeaths(country), '#ff3d47');
        break;

      case this.chartType.recovered:
        this.updateParam(await this.getRecovered(country), '#03dac6');
        break;
      default:
        throw new Error('Wrong chart type');
    }

    this.applyNewParam();
    this.chart.update();
  };
}
