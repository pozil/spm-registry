const puppeteer = require('puppeteer');
const Configuration = require('../utils/configuration');

class PackageInfoParser {
    static async parsePackageInfo(packageId) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Log In
        await page.goto(Configuration.getSfLoginUrl(), {
            waitUntil: 'networkidle2'
        });
        await page.focus('#username');
        await page.keyboard.type(Configuration.getSfUsername());
        await page.focus('#password');
        await page.keyboard.type(Configuration.getSfPassword());
        await page.waitForSelector('#Login');
        await page.click('#Login');
        await page.waitForRequest(
            `${Configuration.getSfLoginUrl()}/lightning/setup/SetupOneHome/home`
        );

        // Navigate to package install URL
        await page.goto(
            `${Configuration.getSfLoginUrl()}/packagingSetupUI/ipLanding.app?apvId=${packageId}`,
            { waitUntil: 'networkidle2' }
        );
        await page.waitForSelector('#pkgInfo');

        // Check for errors
        const errors = await page.evaluate(() => {
            const errorElements = document.querySelectorAll('.errorTable td');
            const errors = [];
            for (let i = 0; i < errorElements.length; i += 2) {
                errors.push({
                    title: errorElements[i].textContent,
                    detail: errorElements[i + 1].textContent
                });
            }
            return errors;
        });
        if (errors.length > 0) {
            await browser.close();
            throw new PackageInfoError(errors);
        }

        // Parse package information
        const packageInfo = await page.evaluate(() => {
            const packageInfoElements = document.querySelectorAll(
                '#pkgInfo .infotext'
            );
            const info = {
                name: packageInfoElements[0].textContent,
                publisher: packageInfoElements[1].textContent,
                versionName: packageInfoElements[2].textContent,
                versionNumber: packageInfoElements[3].textContent,
                description: ''
            };
            // Add description if available
            if (packageInfoElements.length > 4) {
                info.description = packageInfoElements[4].textContent;
            }
            return info;
        });
        await browser.close();
        packageInfo.id = packageId;
        return packageInfo;
    }
}

class PackageInfoError extends Error {
    constructor(errors) {
        super();
        this.errors = errors;
    }

    getErrors() {
        return this.errors;
    }
}

module.exports = {
    PackageInfoParser,
    PackageInfoError
};
