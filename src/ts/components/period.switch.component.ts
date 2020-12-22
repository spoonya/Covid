import Swich from './switch.component';

export default class PeriodSwitch extends Swich {
  constructor(parent: HTMLElement) {
    super(parent, 'ALL', 'LAST', 'days-switch');
    this.storeValue();
  }

  processChange() {
    this.storeValue();
    document.dispatchEvent(new Event('changedata'));
  }

  private storeValue() {
    window.localStorage.setItem('period', this.getValue());
  }
}
