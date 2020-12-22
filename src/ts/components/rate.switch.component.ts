import Swich from './switch.component';

export default class RateSwitch extends Swich {
  constructor(parent: HTMLElement) {
    super(parent, 'ABS', '100K', 'rate-switch');
  }

  processChange() {
    this.storeValue();
    document.dispatchEvent(new Event('changedata'));
  }

  private storeValue() {
    window.localStorage.setItem('rate', this.getValue());
  }
}
