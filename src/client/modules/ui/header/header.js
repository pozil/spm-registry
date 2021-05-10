import { LightningElement } from 'lwc';

export default class Header extends LightningElement {
    searchTerm = null;

    handleSearchTermInput(event) {
        this.searchTerm = event.target.value;
    }

    handleSearchSubmit(event) {
        event.preventDefault();
    }
}
