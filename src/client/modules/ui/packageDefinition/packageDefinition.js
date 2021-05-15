import { LightningElement, api } from 'lwc';

export default class PackageDefinition extends LightningElement {
    @api packageDefinition;

    get hasOtherVersions() {
        return (
            this.packageDefinition && this.packageDefinition.versionCount > 1
        );
    }
}
