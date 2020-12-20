import Chart from 'chart.js';
import * as Api from '../data/api.data';

export default class ChartComponent {
  private parent: HTMLElement;

  private chartAttr: string;

  private chart!: HTMLCanvasElement | null;

  private chartCtx!: any;

  public covidChart!: Chart;

  constructor(parent: HTMLElement, chartAttr: string) {
    this.parent = parent;
    this.chartAttr = chartAttr;
  }

  public initChart = (dataArray: any[], labelsArray: any[]): void => {
    const component: string = `<div class="stats__chart">
                                <canvas  ${this.chartAttr.slice(1, -1)}> </canvas>
                              </div>`;

    this.parent?.insertAdjacentHTML('beforeend', component);
    this.chart = document.querySelector(this.chartAttr);
    this.chartCtx = this.chart?.getContext('2d');

    Chart.defaults.global.defaultFontFamily = 'Heebo, sans-serif';
    Chart.defaults.global.defaultFontSize = 14;

    this.covidChart = new Chart(this.chartCtx, {
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
                callback: (value: number) => `${value / 10e5}M`,
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
}
