import { LightningElement } from 'lwc';

export default class Header extends LightningElement {
    searchTerm = null;

    handleTitleClick(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('gohome'));
    }

    handleSearchTermInput(event) {
        this.searchTerm = event.target.value;
    }

    handleSearchSubmit(event) {
        event.preventDefault();
        if (this.searchTerm && this.searchTerm.trim() !== '') {
            const detail = { key: this.searchTerm, page: 0 };
            this.dispatchEvent(new CustomEvent('search', { detail }));
        }
    }
}
