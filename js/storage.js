// Full storage.js system code with all DEFAULT_DATA

const DEFAULT_DATA = { /* all default data should be defined here */ }; // Replace this comment with the actual default data

class Storage {
    constructor() {
        this.data = DEFAULT_DATA;
    }

    getData() {
        return this.data;
    }

    setData(newData) {
        this.data = { ...this.data, ...newData };
    }

    clearData() {
        this.data = {};
    }
}

export default Storage;