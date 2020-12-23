import Switch from './switch.component';

export default class RateSwitch extends Switch {
  constructor(parent: HTMLElement) {
    super(parent, 'ABS', '100K', 'rate-switch');

    const value = window.localStorage.getItem('rate');

    if (value) {
      this.input.checked = value === '100K';
    } else {
      this.storeValue();
    }
  }

  processChange() {
    this.storeValue();
    document.dispatchEvent(new Event('changedata'));
  }

  private storeValue() {
    window.localStorage.setItem('rate', this.getValue());
  }
}
