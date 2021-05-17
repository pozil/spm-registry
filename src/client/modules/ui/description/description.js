import { LightningElement, api } from 'lwc';

export default class Description extends LightningElement {
    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value.replace('\n', '<br/><br/>');
        this.rerenderValue();
    }

    _value;

    rerenderValue() {
        const rootElement = this.template.querySelector('div');
        if (rootElement !== null) {
            const content = document.createElement('p');
            content.innerHTML = this._value;
            rootElement.appendChild(content);
        }
    }

    renderedCallback() {
        this.rerenderValue();
    }
}
