const REGEX_VERSION = /([0-9]+)\.([0-9]+)(?: \(Beta ([0-9]+)\))?/;

class Version {
    constructor(major, minor, beta) {
        this.major = major;
        this.minor = minor;
        this.beta = beta;
    }

    isGreater(other) {
        if (other === null) {
            return true;
        }
        // Compare major
        if (this.major > other.major) {
            return true;
        }
        if (this.major < other.major) {
            return false;
        }
        // Compare minor
        if (this.minor > other.minor) {
            return true;
        }
        if (this.minor < other.minor) {
            return false;
        }
        // Compare beta
        if (this.beta !== null && other.beta === null) {
            return true;
        }
        if (this.beta === null && other.beta !== null) {
            return false;
        }
        if (this.beta > other.beta) {
            return true;
        }
        if (this.beta < other.beta) {
            return false;
        }
        return false;
    }

    toString() {
        return this.beta === null
            ? `${this.major}.${this.minor}`
            : `${this.major}.${this.minor} (Beta ${this.beta})`;
    }

    static fromString(versionString) {
        if (versionString === null) {
            return null;
        }
        const match = versionString.match(REGEX_VERSION);
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        const beta =
            typeof match[3] === 'undefined' ? null : parseInt(match[3], 10);
        return new Version(major, minor, beta);
    }
}

module.exports = {
    Version
};
