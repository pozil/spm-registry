import { LightningElement } from 'lwc';

const PAGE_HOME = 'home';
const PAGE_SEARCH_RESULTS = 'search-results';
const PAGE_PACKAGE_DEFINITION = 'package-definition';

export default class App extends LightningElement {
    page = PAGE_HOME;
    searchTerm;
    searchResults = [];
    packageDefinition;

    async handleSearch(event) {
        const { key, page } = event.detail;
        try {
            const response = await fetch(
                `/api/v1/search?key=${key}&page=${page}`
            );
            const results = await response.json();
            this.searchResults = results.map((result) => {
                if (!result.description) {
                    result.description = 'Not provided.';
                }
                return result;
            });
            this.page = PAGE_SEARCH_RESULTS;
            this.searchTerm = key;
        } catch (e) {
            console.error('Failed to search', e);
        }
    }

    async handleSelectPackage(event) {
        const packageDefinitionId = event.detail;
        try {
            const response = await fetch(
                `/api/v1/package-definition/${packageDefinitionId}`
            );
            this.packageDefinition = await response.json();
            if (!this.packageDefinition.description) {
                this.packageDefinition.description = 'Not provided.';
            }
            this.page = PAGE_PACKAGE_DEFINITION;
        } catch (e) {
            console.error('Failed to search', e);
        }
    }

    handleGoHome() {
        this.page = PAGE_HOME;
    }

    get isHomePage() {
        return this.page === PAGE_HOME;
    }

    get isPackageDefinitionPage() {
        return this.page === PAGE_PACKAGE_DEFINITION;
    }

    get isSearchResultsPage() {
        return this.page === PAGE_SEARCH_RESULTS;
    }
}
