import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import saleEventModel from "./saleEvent.js";
import Validator from "../helpers/validator.js";

const querValidator = new Validator({
    "start_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NOTNULL()
    },
    "end_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NOTNULL()
    }
});

async function getOrderProductReport(conn, query) {
    let data = utils.objectAssign(["start_at", "end_at"], query);
    let startAt = new Date(data.start_at);
    let endAt = new Date(data.end_at);
    return null
}

async function getOrderCouponReport(conn, query) {
    let data = utils.objectAssign(["start_at", "end_at"], query);
    let startAt = new Date(data.start_at);
    let endAt = new Date(data.end_at);
    return null
}

async function getOrderCustomerReport(conn, query) {
    let data = utils.objectAssign(["start_at", "end_at"], query);
    let startAt = new Date(data.start_at);
    let endAt = new Date(data.end_at);
    return null
}

export default {
    getOrderProductReport,
    getOrderCouponReport,
    getOrderCustomerReport
}
