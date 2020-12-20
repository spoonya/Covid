export default class GlobalCasesComponent {
  private parent!: HTMLElement;

  private searchAttr: string;

  constructor(parent: HTMLElement, searchAttr: string) {
    this.parent = parent;
    this.searchAttr = searchAttr;
    this.init();
  }

  private init = (): void => {
    const component: string = `<div class="cases__search">
                                <h2 class="cases__title">Searching</h2>
                                <input class="cases__input" ${this.searchAttr.slice(1, -1)}
                                  type="text" placeholder="Country">
                              </div>`;
    this.parent?.insertAdjacentHTML('afterbegin', component);
  };

  public searching = (): void => {};
}
