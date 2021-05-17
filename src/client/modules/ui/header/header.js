import { LightningElement, api } from 'lwc';

export default class Header extends LightningElement {
    @api
    get searchTerm() {
        return this._searchTerm;
    }
    set searchTerm(value) {
        this._searchTerm = value;
        const searchInputEl = this.template.querySelector(
            'input[name="searchTerm"]'
        );
        if (searchInputEl) {
            searchInputEl.value = value;
        }
    }

    handleTitleClick(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('gohome'));
    }

    handleSearchTermInput(event) {
        this._searchTerm = event.target.value;
    }

    handleSearchSubmit(event) {
        event.preventDefault();
        if (this._searchTerm && this._searchTerm.trim() !== '') {
            const detail = { key: this._searchTerm, page: 0 };
            this.dispatchEvent(new CustomEvent('search', { detail }));
        }
    }
}
