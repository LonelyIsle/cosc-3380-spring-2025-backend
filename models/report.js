import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import DataType from "../helpers/dataType.js";
import orderModel from "./order.js";
import Validator from "../helpers/validator.js";
import productCategoryModel from "./productCategory.js";

const queryValidator = new Validator({
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
    queryValidator.validate(data);
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
        + ' LEFT JOIN `order_product` ON `product`.`id` = `order_product`.`product_id` '
        + (queryStr.length ? queryStr.join(" ") : " ")
        + ' LEFT JOIN `order` on `order`.`id` = `order_product`.`order_id` AND `order`.status <> ? '
        + ' WHERE `product`.`is_deleted` = ? ',
        params.concat([orderModel.CANCELLED_STATUS, false])
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
    let params = [];
    let queryStr = [];
    queryValidator.validate(data);
    if (data.start_at && data.end_at) {
        let startAt = new Date(data.start_at);
        let endAt = new Date(data.end_at);
        queryStr.push("AND", '(`order`.`created_at` BETWEEN ? AND ?)');
        params.push(startAt, endAt);
    }
    let attributes = [
        '`coupon`.`id` AS `coupon_id`',
        '`coupon`.`code` AS `coupon_code`',
        '`coupon`.`value` AS `coupon_value`',
        '`coupon`.`type` AS `coupon_type`',
        '`coupon`.`start_at` AS `coupon_start_at`',
        '`coupon`.`end_at` AS `coupon_end_at`',
        '`coupon`.`description` AS `coupon_description`',
        '`coupon`.`created_at` AS `coupon_created_at`',
        '`order`.`id` AS `order_id`',
        '`order`.`total_origin` AS `order_total_origin`',
        '`order`.`total_subscription` AS `order_total_subscription`',
        '`order`.`total_coupon` AS `order_total_coupon`',
        '`order`.`shipping_fee` AS `order_shipping_fee`',
        '`order`.`total_sale_tax` AS `order_total_sale_tax`',
        '`order`.`total_final` AS `order_total_final`',
    ]
    const [rows] = await conn.query(
        'SELECT ' + attributes.join(",")
        + ' FROM `coupon` '
        + ' LEFT JOIN `order` on `coupon`.`id` = `order`.`coupon_id` AND `order`.status <> ? '
        + (queryStr.length ? queryStr.join(" ") : " ")
        + ' WHERE `coupon`.`is_deleted` = ? ',
        [orderModel.CANCELLED_STATUS].concat(params, [false])
    );
    let couponHash = {};
    for (let row of rows) {
        if (!couponHash[row.coupon_id]) {
            couponHash[row.coupon_id] = { 
                coupon_id: row.coupon_id,
                coupon_code: row.coupon_code,
                coupon_value: row.coupon_value,
                coupon_type: row.coupon_type,
                coupon_start_at: row.coupon_start_at,
                coupon_end_at: row.coupon_end_at,
                coupon_description: row.coupon_subscription,
                coupon_created_at: row.coupon_created_at,
                coupon_order_count: 0,
                coupon_total_origin: 0,
                coupon_total_subscription: 0,
                coupon_total_coupon: 0,
                coupon_total_shipping: 0,
                coupon_total_sale_tax: 0,
                coupon_total_final: 0
            }
        }
        let obj = couponHash[row.coupon_id];
        obj.coupon_order_count += row.order_id ? 1 : 0,
        obj.coupon_total_origin += row.order_total_origin ? row.order_total_origin : 0,
        obj.coupon_total_subscription += row.order_total_subscription ? row.order_total_subscription : 0,
        obj.coupon_total_coupon += row.order_total_coupon ? row.order_total_coupon : 0,
        obj.coupon_total_shipping += row.order_shipping_fee ? row.order_shipping_fee : 0,
        obj.coupon_total_sale_tax += row.order_total_sale_tax ? row.order_total_sale_tax : 0,
        obj.coupon_total_final += row.order_total_final ? row.order_total_final : 0
    }
    return Object.values(couponHash);
}

async function getOrderCustomerReport(conn, query) {
    let data = utils.objectAssign(["start_at", "end_at"], query);
    let params = [];
    let queryStr = [];
    queryValidator.validate(data);
    if (data.start_at && data.end_at) {
        let startAt = new Date(data.start_at);
        let endAt = new Date(data.end_at);
        queryStr.push("AND", '(`order`.`created_at` BETWEEN ? AND ?)');
        params.push(startAt, endAt);
    }
    let attributes = [
        '`customer`.`id` AS `customer_id`',
        '`customer`.`email` AS `customer_email`',
        '`customer`.`created_at` AS `customer_created_at`',
        '`order`.`id` AS `order_id`',
        '`order`.`subscription_id` AS `order_subscription_id`',
        '`order`.`total_origin` AS `order_total_origin`',
        '`order`.`total_subscription` AS `order_total_subscription`',
        '`order`.`total_coupon` AS `order_total_coupon`',
        '`order`.`shipping_fee` AS `order_shipping_fee`',
        '`order`.`total_sale_tax` AS `order_total_sale_tax`',
        '`order`.`total_final` AS `order_total_final`',
    ]
    const [rows] = await conn.query(
        'SELECT ' + attributes.join(",")
        + ' FROM `customer`'
        + ' LEFT JOIN `order` on `customer`.`id` = `order`.`customer_id` AND `order`.status <> ? '
        + (queryStr.length ? queryStr.join(" ") : " ")
        + ' WHERE `customer`.`is_deleted` = ? ',
        [orderModel.CANCELLED_STATUS].concat(params, [false])
    );
    let customerHash = {};
    for (let row of rows) {
        if (!customerHash[row.customer_id]) {
            customerHash[row.customer_id] = { 
                customer_id: row.customer_id,
                customer_email: row.customer_email,
                customer_created_at: row.customer_created_at,
                customer_order_count: 0,
                customer_order_subscription_count: 0,
                customer_order_no_subscription_count: 0,
                customer_order_total_origin: 0,
                customer_order_total_subscription: 0,
                customer_order_total_coupon: 0,
                customer_order_total_shipping: 0,
                customer_order_total_sale_tax: 0,
                customer_order_total_final: 0,
                customer_order_subscription_total_origin: 0,
                customer_order_subscription_total_subscription: 0,
                customer_order_subscription_total_coupon: 0,
                customer_order_subscription_total_shipping: 0,
                customer_order_subscription_total_sale_tax: 0,
                customer_order_subscription_total_final: 0,
                customer_order_no_subscription_total_origin: 0,
                customer_order_no_subscription_total_subscription: 0,
                customer_order_no_subscription_total_coupon: 0,
                customer_order_no_subscription_total_shipping: 0,
                customer_order_no_subscription_total_sale_tax: 0,
                customer_order_no_subscription_total_final: 0
            }
        }
        let obj = customerHash[row.customer_id];
        obj.customer_order_count += row.order_id ? 1 : 0;
        obj.customer_order_total_origin += row.order_total_origin ? row.order_total_origin : 0;
        obj.customer_order_total_subscription += row.order_total_subscription ? row.order_total_subscription : 0;
        obj.customer_order_total_coupon += row.order_total_coupon ? row.order_total_coupon : 0;
        obj.customer_order_total_shipping += row.order_total_shipping ? row.order_total_shipping : 0;
        obj.customer_order_total_sale_tax += row.order_total_sale_tax ? row.order_total_sale_tax : 0;
        obj.customer_order_total_final += row.order_total_final ? row.order_total_final : 0;
        if (row.order_subscription_id) {
            obj.customer_order_subscription_count += row.order_id ? 1 : 0;
            obj.customer_order_subscription_total_origin += row.order_total_origin ? row.order_total_origin : 0;
            obj.customer_order_subscription_total_subscription += row.order_total_subscription ? row.order_total_subscription : 0;
            obj.customer_order_subscription_total_coupon += row.order_total_coupon ? row.order_total_coupon : 0;
            obj.customer_order_subscription_total_shipping += row.order_total_shipping ? row.order_total_shipping : 0;
            obj.customer_order_subscription_total_sale_tax += row.order_total_sale_tax ? row.order_total_sale_tax : 0;
            obj.customer_order_subscription_total_final += row.order_total_final ? row.order_total_final : 0;
        } else {
            obj.customer_order_no_subscription_count += row.order_id ? 1 : 0;
            obj.customer_order_no_subscription_total_origin += row.order_total_origin ? row.order_total_origin : 0;
            obj.customer_order_no_subscription_total_subscription += row.order_total_subscription ? row.order_total_subscription : 0;
            obj.customer_order_no_subscription_total_coupon += row.order_total_coupon ? row.order_total_coupon : 0;
            obj.customer_order_no_subscription_total_shipping += row.order_total_shipping ? row.order_total_shipping : 0;
            obj.customer_order_no_subscription_total_sale_tax += row.order_total_sale_tax ? row.order_total_sale_tax : 0;
            obj.customer_order_no_subscription_total_final += row.order_total_final ? row.order_total_final : 0;
        }
    }
    return Object.values(customerHash);
}

export default {
    getOrderProductReport,
    getOrderCouponReport,
    getOrderCustomerReport
}


 