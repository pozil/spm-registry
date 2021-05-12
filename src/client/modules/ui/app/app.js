import { LightningElement } from 'lwc';

const PAGE_HOME = 'home';
const PAGE_SEARCH_RESULTS = 'search-results';

export default class App extends LightningElement {
    page = PAGE_HOME;
    searchTerm;
    searchResults = [];

    async handleSearch(event) {
        const { key, page } = event.detail;
        try {
            const response = await fetch(
                `/api/v1/search?key=${key}&page=${page}`
            );
            const result = await response.json();
            this.page = PAGE_SEARCH_RESULTS;
            this.searchTerm = key;
            this.searchResults = result;
        } catch (e) {
            console.error('Failed to search', e);
        }
    }

    get isHomePage() {
        return this.page === PAGE_HOME;
    }

    get isSearchResultsPage() {
        return this.page === PAGE_SEARCH_RESULTS;
    }
}
