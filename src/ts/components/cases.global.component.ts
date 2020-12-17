export default class GlobalCasesComponent {
  private parent!: HTMLElement;

  private casesAttr: string;

  constructor(parent: HTMLElement, casesAttr: string) {
    this.parent = parent;
    this.casesAttr = casesAttr;
    this.init();
  }

  private init = (): void => {
    const component: string = `<div class="cases__global">
                                <h2 class="cases__title">Global cases</h2>
                                <p class="cases__number" ${this.casesAttr.slice(1, -1)}></p>
                              </div>`;
    this.parent?.insertAdjacentHTML('afterbegin', component);
  };

  public setCases = (cases: string): void => {
    const casesElement = this.parent.querySelector(this.casesAttr);

    casesElement!.textContent = cases;
  };
}
