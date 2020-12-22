export default class SwitchesComponent {
  private parent!: HTMLElement;

  private switchesArrayAttr: any;

  constructor(parent: HTMLElement, attrArray: any) {
    this.parent = parent;
    this.switchesArrayAttr = attrArray;
    this.init();
  }

  public init = (): void => {
    for (let i = 0; i < this.switchesArrayAttr.length; i++) {
      this.parent?.insertAdjacentHTML(
        'beforeend',
        `<label class="toggle-switchy" data-size="lg"
            ${this.switchesArrayAttr[i].attr.slice(1, -1)} title="${this.switchesArrayAttr[i].title}">
          <input checked type="checkbox">
            <span class="toggle">
              <span class="switch"></span>
            </span>
        </label>`,
      );
    }
  };

  public controlSwitchDays = (): void => {
    const switchDays: HTMLElement | null = this.parent.querySelector(this.switchesArrayAttr[0].attr);
  };

  public controlSwitchRate = (): void => {
    const switchRate: HTMLElement | null = this.parent.querySelector(this.switchesArrayAttr[1].attr);
  };
}
