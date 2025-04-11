import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import DataType from "../helpers/dataType.js";
import orderModel from "./order.js";
import Validator from "../helpers/validator.js";
import productCategoryModel from "./productCategory.js";

const querValidator = new Validator({
    "start_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "end_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    }
});

async function getOrderProductReport(conn, query) {
    let data = utils.objectAssign(["start_at", "end_at"], query);
    let params = [];
    let queryStr = [];
    if (data.start_at && data.end_at) {
        let startAt = new Date(data.start_at);
        let endAt = new Date(data.end_at);
        queryStr.push("AND", '(`order_product`.`created_at` BETWEEN ? AND ?)');
        params.push(startAt, endAt);
    }
    let attributes = [
        '`product`.`id` AS `product_id`',
        '`product`.`sku` AS `product_sku`',
        '`product`.`name` AS `product_name`',
        '`product`.`description` AS `product_description`',
        '`product`.`price` AS `product_price`',
        '`product`.`quantity` AS `product_quantity`',
        '`product`.`threshold` AS `product_threshold`',
        '`product`.`created_at` AS `product_created_at`',
        '`order_product`.`quantity` AS `order_product_quantity`',
        '`order_product`.`price` AS `order_product_price`',
        '`order`.`id` AS `order_id`'
    ]
    const [rows] = await conn.query(
        'SELECT ' + attributes.join(",")
        + ' FROM `product` '
        + ' LEFT JOIN `order_product` on `product`.`id` = `order_product`.`product_id` '
        + ' LEFT JOIN `order` on `order`.`id` = `order_product`.`order_id` '
        + ' WHERE `product`.`is_deleted` = ? AND (`order`.`status` IS NULL || `order`.status <> ?) '
        + (queryStr.length ? queryStr.join(" ") : " ")
        + ' ORDER BY `product`.`id` ASC ',
        [false, orderModel.CANCELLED_STATUS].concat(params)
    );
    let productHash = {};
    for (let row of rows) {
        if (!productHash[row.product_id]) {
            productHash[row.product_id] = { 
                product_id: row.product_id,
                product_sku: row.product_sku,
                product_name: row.product_name,
                product_description: row.product_description,
                product_price: row.product_price,
                product_quantity: row.product_quantity,
                product_threshold: row.product_threshold,
                product_created_at: row.product_created_at,
                product_order_count: 0,
                product_total_quantity: 0,
                product_total_price: 0,
                product_category: await productCategoryModel.getCategoryByProductId(conn, row.product_id)
            }
        }
        let obj = productHash[row.product_id];
        obj.product_order_count += row.order_id ? 1 : 0,
        obj.product_total_quantity += row.order_product_quantity ? row.order_product_quantity : 0,
        obj.product_total_price += row.order_product_price ? row.order_product_quantity * row.order_product_price : 0
    }
    return Object.values(productHash);
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
