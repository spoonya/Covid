import prettifyNumber from '../helpers/pretiffy.number.helper';
import DOM from '../constants/dom.const';

export default class TableComponent {
  private col!: HTMLElement;

  private row!: HTMLElement;

  private table: HTMLElement = document.createElement('table');

  private header: HTMLElement = document.createElement('thead');

  private tBody: HTMLElement = document.createElement('tbody');

  private headerArray?: string[] | null = [];

  private dataArray: any[][] = [];

  constructor(dataArray: any[][], headerArray?: string[]) {
    this.headerArray = headerArray;
    this.dataArray = dataArray;
    this.createTable();
  }

  private createHeader = (): void => {
    if (this.headerArray) {
      const headerArrayLength: number = this.headerArray?.length;

      for (let i = 0; i < headerArrayLength; i++) {
        this.col = document.createElement('th');
        this.col.textContent = this.headerArray[i];

        this.header.append(this.col);
      }

      this.table.append(this.header);
    }
  };

  private createBody = (): void => {
    const dataArrayLength: number = this.dataArray.length;

    for (let i = 0; i < dataArrayLength; i++) {
      this.row = document.createElement('tr');

      for (let j = 0; j < this.dataArray[i].length; j++) {
        this.col = document.createElement('td');

        this.col.innerHTML =
          typeof this.dataArray[i][j] === 'number' ? prettifyNumber(this.dataArray[i][j]) : this.dataArray[i][j];

        this.row.append(this.col);
      }

      this.tBody.append(this.row);
    }

    this.table.append(this.tBody);
  };

  private createTable = (): TableComponent => {
    this.createHeader();
    this.createBody();
    this.table.classList.add(DOM.classes.table);

    return this;
  };

  public render = (container: HTMLElement): void => {
    container.innerHTML = '';
    container.append(this.table);
  };
}
