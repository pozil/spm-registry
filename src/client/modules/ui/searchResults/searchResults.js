import { LightningElement, api } from 'lwc';

const PAGE_SIZE = 10;

export default class SearchResults extends LightningElement {
    @api searchTerm;
    @api results;

    handlePreviousPageClick() {
        if (this.results.pageNumber > 0) {
            const pageNumber = this.results.pageNumber - 1;
            this.doSearch(pageNumber);
        }
    }

    handleNextPageClick() {
        if (this.results.pageNumber < this.totalPages - 1) {
            const pageNumber = this.results.pageNumber + 1;
            this.doSearch(pageNumber);
        }
    }

    doSearch(page) {
        const detail = { key: this.searchTerm, page };
        this.dispatchEvent(new CustomEvent('search', { detail }));
    }

    get hasResults() {
        return this.results.packages.length > 0;
    }

    get resultStatsLabel() {
        const currentItemCount = this.results.packages.length;
        const allItemCount = this.results.totalCount;
        let label;
        if (currentItemCount === allItemCount) {
            label = `Showing ${allItemCount} package${
                allItemCount === 1 ? '' : 's'
            }`;
        } else {
            label = `Showing ${currentItemCount} package${
                currentItemCount === 1 ? '' : 's'
            } out of ${allItemCount}`;
        }
        if (this.totalPages > 1) {
            label += ` • page ${this.results.pageNumber + 1} out of ${
                this.totalPages
            }`;
        }
        return label;
    }

    get totalPages() {
        return Math.ceil(this.results.totalCount / PAGE_SIZE);
    }

    get isLastPage() {
        return (
            this.results.totalCount === 0 ||
            (this.results.pageNumber + 1) * PAGE_SIZE >= this.results.totalCount
        );
    }

    get isFirstPage() {
        return this.results.pageNumber === 0;
    }
}
