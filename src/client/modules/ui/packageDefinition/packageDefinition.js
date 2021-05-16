import { LightningElement, api } from 'lwc';

export default class PackageDefinition extends LightningElement {
    @api packageDefinition;

    get appExchangeSearchUrl() {
        if (!this.packageDefinition) {
            return '';
        }
        const pkgName = encodeURI(this.packageDefinition.name);
        return `https://appexchange.salesforce.com/appxSearchKeywordResults?keywords=${pkgName}`;
    }

    get hasOtherVersions() {
        return (
            this.packageDefinition && this.packageDefinition.versionCount > 1
        );
    }
}
