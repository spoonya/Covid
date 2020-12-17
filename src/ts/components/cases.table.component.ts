import prettifyNumber from '../helpers/pretiffy.number.helper';

export default class CasesTableComponent {
  private parent!: HTMLElement;

  private tableCol!: HTMLElement;

  private tableRow!: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    // this.init();
  }

  // private init = (): void => {
  //   const component: string = `<div class="cases__global">
  //                               <h2 class="cases__title">Global cases</h2>
  //                               <p class="cases__number" ${this.casesAttr.slice(1, -1)}></p>
  //                             </div>`;
  //   this.parent?.insertAdjacentHTML('afterbegin', component);
  // };

  public fillTable = (countries: any): void => {
    const tableBody = this.parent.querySelector('tbody');
    countries.sort((a: any, b: any) => b.TotalConfirmed - a.TotalConfirmed);

    for (let i = 0; i < countries.length; i++) {
      this.tableRow = document.createElement('tr');

      // this.tableCol = document.createElement('td');
      // this.tableCol.innerText = countries[i].CountryCode;
      // this.tableRow.append(this.tableCol);

      this.tableCol = document.createElement('td');
      this.tableCol.innerText = countries[i].Country;
      this.tableRow.append(this.tableCol);

      this.tableCol = document.createElement('td');
      this.tableCol.innerText = prettifyNumber(countries[i].TotalConfirmed);
      this.tableRow.append(this.tableCol);

      tableBody?.append(this.tableRow);
    }
  };
}
