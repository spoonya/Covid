export default class DateComponent {
  private parent!: HTMLElement;

  private dateAttr: string;

  constructor(parent: HTMLElement, dateAttr: string) {
    this.parent = parent;
    this.dateAttr = dateAttr;
    this.init();
  }

  public init = (): void => {
    const component: string = `<div class="cases__date">
                                <h2 class="cases__title">Last updated at (M/D/YYYY)</h2>
                                <p class="cases__date-value" ${this.dateAttr.slice(1, -1)}></p>
                              </div>`;
    this.parent?.insertAdjacentHTML('beforeend', component);
  };

  public setDate = (date: Date): void => {
    const formattedDate: string = new Date(date).toLocaleString('en-us');
    const dateElement = this.parent.querySelector(this.dateAttr);

    dateElement!.textContent = formattedDate;
  };
}
