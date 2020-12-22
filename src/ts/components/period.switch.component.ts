import Swich from './switch.component';

export default class PeriodSwitch extends Swich {
  constructor(parent: HTMLElement) {
    super(parent, 'ALL', 'LAST', 'days-switch');

    const value = window.localStorage.getItem('period');

    if (value) {
      this.input.checked = value === 'LAST';
    } else {
      this.storeValue();
    }
  }

  processChange() {
    this.storeValue();
    document.dispatchEvent(new Event('changedata'));
  }

  private storeValue() {
    window.localStorage.setItem('period', this.getValue());
  }
}
