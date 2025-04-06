import { HttpError } from "../helpers/error.js";

class Validator {
    validate(row) {
        for (let attr in this.attribute) {
            if (attr in row) {
                for (let key in this.attribute[attr]) {
                    if(!this.attribute[attr][key].validate(row[attr])) {
                        throw new HttpError({ statusCode: 400, message: `${attr} is invalid.` });
                    }
                }
            }
        }
    }

    constructor(attribute) {
        this.attribute = attribute;
    }
}

export default Validator;