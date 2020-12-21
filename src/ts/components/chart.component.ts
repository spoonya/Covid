import Chart from 'chart.js';
import { data } from '../index';

interface ChartCfg {
  lastUpdType?: string;
  readonly cases?: string;
  readonly deaths?: string;
  readonly recovered?: string;
  dataArray?: number[];
  color?: string;
  title?: string;
}

export default class ChartComponent {
  private parent: HTMLElement;

  private chartAttr: string;

  private chartContainer!: HTMLCanvasElement | null;

  private chartCtx!: any;

  public chart!: Chart;

  private chartType: ChartCfg = {
    lastUpdType: 'cases',
    cases: 'cases',
    deaths: 'deaths',
    recovered: 'recovered',
  };

  private chartParamUpd: ChartCfg = {
    dataArray: [],
    color: '',
    title: '',
  };

  constructor(parent: HTMLElement, chartAttr: string) {
    this.parent = parent;
    this.chartAttr = chartAttr;
  }

  public initChart = (dataArray: any[], labelsArray: any[]): void => {
    const component: string = `<div class="stats__chart">
                                <canvas  ${this.chartAttr.slice(1, -1)}> </canvas>
                              </div>`;

    this.parent?.insertAdjacentHTML('beforeend', component);
    this.chartContainer = document.querySelector(this.chartAttr);
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
        maintainAspectRatio: true,
        title: {
          fontColor: '#fff',
          display: true,
          text: 'Cumulative cases',
          fontSize: 16,
          fontStyle: 'normal',
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

  private updateParam = (array: number[], color: string, title: string) => {
    this.chartParamUpd.dataArray = array;
    this.chartParamUpd.color = color;
    this.chartParamUpd.title = title;
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

    this.chart.options.title!.text = this.chartParamUpd.title;
  };

  public updateChart = async (country?: string): Promise<void> => {
    switch (this.chartType.lastUpdType) {
      case this.chartType.cases:
        this.updateParam(await this.getCases(country), '#bb86fc', 'Cumulative cases');
        break;

      case this.chartType.deaths:
        this.updateParam(await this.getDeaths(country), '#ff3d47', 'Cumulative deaths');
        break;

      case this.chartType.recovered:
        this.updateParam(await this.getRecovered(country), '#03dac6', 'Cumulative recovered');
        break;
      default:
        throw new Error('Wrong chart type');
    }

    this.applyNewParam();
    this.chart.update();
  };
}
