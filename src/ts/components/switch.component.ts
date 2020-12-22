export default abstract class Swich {
  protected input: HTMLInputElement;

  protected value1: string;

  protected value2: string;

  constructor(parent: HTMLElement, value1: string, value2: string, protected id: string) {
    this.value1 = value1;
    this.value2 = value2;

    const container = document.createElement('div');
    container.classList.add('switch-wrapper');
    container.innerHTML += value1;

    const label = document.createElement('label');
    label.classList.add('switch');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    if (id) input.id = id;

    label.insertAdjacentElement('beforeend', input);
    label.innerHTML += '<span class="slider round"></span>';

    container.insertAdjacentElement('beforeend', label);

    container.innerHTML += value2;

    parent.insertAdjacentElement('beforeend', container);

    this.input = document.querySelector(`#${id}`) as HTMLInputElement;
    document.querySelector(`#${id}`)?.addEventListener('click', this.processChange.bind(this));
  }

  protected getValue() {
    return this.input.checked ? this.value2 : this.value1;
  }

  protected abstract processChange(): void;
}
