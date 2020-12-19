export default class CountriesCountComponent {
  private parent!: HTMLElement;

  private countAttr: string;

  constructor(parent: HTMLElement, countAttr: string) {
    this.parent = parent;
    this.countAttr = countAttr;
    this.init();
  }

  public init = (): void => {
    const component: string = `<div class="world__cases">
                                  <p class="world__number" ${this.countAttr.slice(1, -1)}></p>
                                  <h2 class="world__title">Affected countries</h2>
                                </div>`;
    this.parent?.insertAdjacentHTML('beforeend', component);
  };

  public setCountriesCount = (count: number): void => {
    const countriesCount = this.parent.querySelector(this.countAttr);

    countriesCount!.textContent = count.toString();
  };
}
