class INT {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
    }
    constructor() {}
}

class VARCHAR {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
        if (val && val.length > this.maxLength) {
            throw new error(`${attr} violates max length of ${this.maxLength}`);
        }
    }

    constructor({ maxLength }) {
        this.maxLength = maxLength === undefined ? 65535 : maxLength
    }
}

class LONGTEXT {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
        if (val && val.length > 4294967295) {
            throw new error(`${attr} violates max length of 4,294,967,295`);
        }
    }
    constructor() {}
}

class TIMESTAMP {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
    }
    constructor() {}
}

class TINYINT {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
        if (val && (val < 0 || val > 1)) {
            throw new error (`${attr} must be 0 or 1`);
        }
    }
    constructor() {

    }
}

class NULLABLE {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
    }
    constructor() {}
}

class NOTNULL {
    validate(val, attr) {
        attr = attr === undefined ? val : attr;
        if (val === null) {
            throw new Error(`${attr} cannot be null`);
        }
        if (val === undefined) {
            throw new Error(`${attr} cannot be undefined`);
        }
        if (typeof val === "string" && val.trim() === "") {
            throw new Error(`${attr} cannot be empty`);
        }
    }
    constructor() {}
}

class DataType {
    static INT() { return new INT(); }
    static VARCHAR(opt) { return new VARCHAR(opt); }
    static LONGTEXT() { return new LONGTEXT(); }
    static TIMESTAMP() { return new TIMESTAMP(); }
    static TINYINT() { return new TINYINT(); }
    static NULLABLE() { return new NULLABLE(); }
    static NOTNULL() { return new NOTNULL(); }
}

export default DataType