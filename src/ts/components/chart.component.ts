import Chart from 'chart.js';
import { data } from '../index';

export default class ChartComponent {
  private parent: HTMLElement;

  private chartAttr: string;

  private chartContainer!: HTMLCanvasElement | null;

  private chartCtx!: any;

  public chart!: Chart;

  public chartCfg = {
    cases: {},
    deathes: {},
    recovered: {},
    default: {},
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
            label: 'Cases',
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
          position: 'right',
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
        tooltips: {
          enabled: true,
        },
      },
    });
  };

  public updateByMutating = async (country?: string): Promise<void> => {
    const dataArray: any = country
      ? (await data.getCovidCountryHistory(country)).timeline.cases
      : (await data.getCovidHistory()).cases;

    const dataCases: number[] = Object.values(dataArray);

    this.chart.data.datasets = [
      {
        label: 'Cases',
        data: dataCases,
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
    ];

    this.chart.update();
  };
}
