const clientRelease = jest.fn(() => Promise.resolve());

class Client {
    constructor(results) {
        this.resultIndex = -1;
        this.results = results.map((res) => ({
            rowCount: res.length,
            rows: res
        }));
    }

    query() {
        return new Promise((resolve) => {
            this.resultIndex++;
            if (this.resultIndex > this.results.length) {
                throw new Error('Mock client ran too many queries');
            }
            resolve(this.results[this.resultIndex]);
        });
    }

    release() {
        return clientRelease();
    }
}

class Pool {
    constructor(results) {
        this.mockClient = new Client(results);
    }

    connect() {
        return Promise.resolve(this.mockClient);
    }
}

module.exports = {
    Pool,
    clientRelease
};
