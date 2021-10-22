const puppeteer = require('puppeteer');
const Configuration = require('../utils/configuration');

class PackageInfoParser {
    static async parsePackageInfo(packageId) {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();

        // Open login page
        try {
            await page.goto(Configuration.getSfLoginUrl(), {
                waitUntil: 'networkidle2'
            });
        } catch (e) {
            const newErr = new Error('An error occured during login page load');
            newErr.stack += '\nCaused by: ' + e.stack;
            throw newErr;
        }

        // Fill login form
        try {
            await page.focus('#username');
            await page.keyboard.type(Configuration.getSfUsername());
            await page.focus('#password');
            await page.keyboard.type(Configuration.getSfPassword());
            await page.waitForSelector('#Login');
            await page.click('#Login');
        } catch (e) {
            const newErr = new Error(
                'An error occured during login form interaction'
            );
            newErr.stack += '\nCaused by: ' + e.stack;
            throw newErr;
        }

        // Setup page load
        try {
            await page.waitForRequest(
                `${Configuration.getSfLoginUrl()}/lightning/setup/SetupOneHome/home`
            );
        } catch (e) {
            const newErr = new Error('An error occured during setup page load');
            newErr.stack += '\nCaused by: ' + e.stack;
            throw newErr;
        }

        // Navigate to package install URL
        try {
            await page.goto(
                `${Configuration.getSfLoginUrl()}/packagingSetupUI/ipLanding.app?apvId=${packageId}`,
                { waitUntil: 'networkidle2' }
            );
            await page.waitForSelector('#pkgInfo');
        } catch (e) {
            const newErr = new Error(
                'An error occured during package install page load'
            );
            newErr.stack += '\nCaused by: ' + e.stack;
            throw newErr;
        }

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
            const packageInfoElements =
                document.querySelectorAll('#pkgInfo .infotext');

            // Clean version number
            let versionNumber = packageInfoElements[3].textContent;
            if (versionNumber.endsWith('Release Notes')) {
                versionNumber.substring(0, versionNumber.length - 13).trim();
            }

            const info = {
                name: packageInfoElements[0].textContent,
                publisher: packageInfoElements[1].textContent,
                versionName: packageInfoElements[2].textContent,
                versionNumber,
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
        console.log('Parsed package info: ', JSON.stringify(packageInfo));
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
