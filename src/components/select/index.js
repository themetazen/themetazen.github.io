import './select.scss';

/* 
    Options

    - data
    - valueDefault
    - onChange
    - position
*/

export default class Select {
    constructor(selector, options) {
        this.el = document.querySelector(selector);
        this.el.classList.add('select');
        this.options = options;
        this.selected = options.valueDefault;
        
        this.position = (() => {
            if (options.position === 'top') {
                return 'top';
            } else {
                return 'bottom';
            }
        })();

        this.#render();
        this.#setup();
    }

    #render() {
        this.el.innerHTML = this.#template();
    }

    #setup() {
        this.el.addEventListener('click', (event) => {
            const { type } = event.target.dataset;

            if (type === 'input' || type === undefined || type === 'arrow') {
                this.toggle();
            } else if (type === 'item') {
                const id = event.target.dataset.id;
                this.select(id);
                this.close();
            } else if (type === 'backdrop') {
                this.close();
            }
        });
        this.value = this.el.querySelector('span');
    }

    get isOpen() {
        return this.el.classList.contains('open');
    }

    select(id) {
        const { data } = this.options;
        this.selected = id;
        const selected = data.find((item) => item.name === this.selected);
        this.value.textContent = selected.label;
        this.options.onChange ? this.options.onChange(selected) : null;
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

        // const text = this.selected
        //     ? data[this.selected]
        //     : data[Object.keys(data)[0]];

        const selected = this.selected ? data.find((item) => item.name === this.selected) : data[0];

        const items = data.map((item) => {
            return `<li class="select__item" data-type="item" data-id="${item.name}">${item.label}</li>`;
        });

        return `
        <div class="select__backdrop" data-type="backdrop"></div>
        <div class="select__input" data-type="input">
          <span>${selected.label}</span>
          <i class="fa fa-chevron-down" data-type="arrow"></i> 
        </div>
        <div class="select__dropdown ${this.position}">
          <ul class="select__list">
            ${items.join('')}
          </ul>
        </div>
    `;
    }
}
