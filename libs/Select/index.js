export default class Select {
    constructor(selector, options) {
        this.el = document.querySelector(selector);
        this.el.classList.add('select');
        this.options = options;
        this.selected = options.valueDefault;

        this.#render();
        this.#setup();
    }

    #render() {
        this.el.innerHTML = this.#template();
    }

    #setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.el.addEventListener('click', this.clickHandler);
        this.value = this.el.querySelector('span');
    }

    clickHandler(event) {
        const { type } = event.target.dataset;

        if (type === 'input') {
            this.toggle();
        } else if (type === 'item') {
            const id = event.target.dataset.id;
            this.select(id);
            this.close();
        } else if (type === 'backdrop') {
            this.close();
        }
    }

    get isOpen() {
        return this.el.classList.contains('open');
    }

    select(id) {
        this.selected = id;
        this.value.textContent = this.options.data[id];
        this.options.onChange ? this.options.onChange(this.selected) : null;
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.el.classList.add('open');
    }

    close() {
        this.el.classList.remove('open');
    }

    #template() {
        const { data } = this.options;

        const text = this.selected
            ? data[this.selected]
            : data[Object.keys(data)[0]];
        const items = Object.keys(data).map((item) => {
            return `<li class="select__item" data-type="item" data-id="${item}">${data[item]}</li>`;
        });

        return `
        <div class="select__backdrop" data-type="backdrop"></div>
        <div class="select__input" data-type="input">
          <span>${text}</span>
          <i class="fa fa-chevron-down" data-type="arrow"></i> 
        </div>
        <div class="select__dropdown">
          <ul class="select__list">
            ${items.join('')}
          </ul>
        </div>
    `;
    }
}
