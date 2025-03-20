import { HttpError } from "../helpers/error.js";

class INT {
    validate(val, attr = val) {}
    constructor() {}
}

class VARCHAR {
    validate(val, attr = val) {
        if (val && val.length > this.maxLength) {
            throw new HttpError({ statusCode: 400, message: `${attr} violates max length of ${this.maxLength}` });
        }
    }

    constructor({ maxLength }) {
        this.maxLength = maxLength === undefined ? 65535 : maxLength
    }
}

class LONGTEXT {
    validate(val, attr = val) {
        if (val && val.length > 4294967295) {
            throw new HttpError({ statusCode: 400, message: `${attr} violates max length of 4,294,967,295` });
        }
    }
    constructor() {}
}

class TIMESTAMP {
    validate(val, attr = val) {}
    constructor() {}
}

class TINYINT {
    validate(val, attr = val) {
        if (val && (val < 0 || val > 1)) {
            throw new HttpError({ statusCode: 400, message: `${attr} must be 0 or 1` });
        }
    }
    constructor() {

    }
}

class NULLABLE {
    validate(val, attr = val) {}
    constructor() {}
}

class NOTNULL {
    validate(val, attr = val) {
        if (val === null) {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be null` });
        }
        if (val === undefined) {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be undefined` });
        }
        if (typeof val === "string" && val.trim() === "") {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be empty` });
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