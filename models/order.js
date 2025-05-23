import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import customerModel from "./customer.js";
import configModel from "./config.js";
import couponModel from "./coupon.js";
import orderProductModel from "./orderProduct.js";
import productModel from "./product.js";
import Validator from "../helpers/validator.js";
import subscriptionModel from "./subscription.js";

const CANCELLED_STATUS = -1;
const PLACED_STATUS = 0;
const SHIPPED_STATUS = 1;
const STATUS = [CANCELLED_STATUS, PLACED_STATUS, SHIPPED_STATUS];

const orderTable = new Table("order", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "customer_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "customer_first_name": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "customer_middle_name": {
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "customer_last_name": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "customer_email": {
        type: DataType.STRING({ check: (val) => /^.+@.+$/.test(val)}),
        isRequired: DataType.NOTNULL()
    },
    "subscription_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "subscription_discount_percentage": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "coupon_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "coupon_value": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "coupon_type": {
        type: DataType.NUMBER({ check: (val) => couponModel.TYPES.indexOf(val) > -1 }),
        isRequired: DataType.NULLABLE()
    },
    "shipping_fee": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "sale_tax": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "total_origin": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "total_subscription": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "total_coupon": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "total_sale_tax": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "total_final": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "tracking": {
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "status": {
        type: DataType.NUMBER({ check: (val) => STATUS.indexOf(val) > -1 }),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_1": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_2": { 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "shipping_address_city": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_state": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_zip": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_1": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_2": { 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "billing_address_city": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_state": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_zip": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_name": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_number": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_expire_month": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_expire_year": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_code": { 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "created_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "updated_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "deleted_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "is_deleted": {
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: ["total_final", "created_at", "updated_at"],
    filter: {
        "customer_email": DataType.STRING(),
    }
});

const itemsValidator = new Validator({
    items: {
        types: DataType.ARRAY(DataType.ANY()),
        isRequired: DataType.NOTNULL()
    }
});

async function include(conn, rows, opt = {}) {
    opt = utils.objectAssign(["inclImg"], { inclImg: true }, opt);
    const _include = async (obj) => {
        if (obj) {
            obj.items = await orderProductModel.getProductByOrderId(conn, obj.id, { include: true, inclImg: opt.inclImg });
            if (obj.customer_id) {
                obj.customer = await customerModel.getOne(conn, obj.customer_id);
                customerModel.prepare(obj.customer);
            } else {
                obj.customer = null;
            }
            if (obj.subscription_id) {
                obj.subscription = await subscriptionModel.getOne(conn, obj.subscription_id);
            } else {
                obj.subscription = null;
            }
            if (obj.coupon_id) {
                obj.coupon = await couponModel.getOne(conn, obj.coupon_id);
            } else {
                obj.coupon = null;
            }
        }
    }
    if (!Array.isArray(rows)) {
        await _include(rows);
    } else {
        for (let row of rows) {
            await _include(row);
        }
    }
}

function prepare(rows) {
    const _prepare = (obj) => {
        if (obj) {
            delete obj.card_name;
            delete obj.card_number;
            delete obj.card_expire_month;
            delete obj.card_expire_year;
            delete obj.card_code;   

            customerModel.prepareStrict(obj.customer);
            subscriptionModel.prepare(obj.subscription);
        }
    }
    if (!Array.isArray(rows)) {
        _prepare(rows);
    } else {
        for (let row of rows) {
            _prepare(row);
        }
    }
}

async function getAll(conn, query, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = orderTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `order`.`id`) FROM `order` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr),
        whereParams
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `order`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT `order`.* FROM `order` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr)
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        whereParams.concat(pagingParams)
    );
    if (opt.include) {
        await include(conn, rows, { inclImg: false });
    }
    return {
        total,
        limit: pagingQueryStr ? parsedQuery.limit : total,
        offset: pagingQueryStr ? parsedQuery.offset : 0,
        rows
    };
}

async function getAllByCustomerId(conn, customer_id, query, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["customer_id"], { customer_id });
    orderTable.validate(data);
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = orderTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `order`.`id`) FROM `order` ' 
        + (!whereQueryStr ? ' WHERE (`order`.`customer_id` = ?) ' :  ' WHERE (`order`.`customer_id` = ?) AND ' + whereQueryStr),
        [data.customer_id].concat(whereParams)
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `order`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT `order`.* FROM `order` ' 
        + (!whereQueryStr ? ' WHERE (`order`.`customer_id` = ?) ' :  ' WHERE (`order`.`customer_id` = ?) AND ' + whereQueryStr)
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        [data.customer_id].concat(whereParams, pagingParams)
    );
    if (opt.include) {
        await include(conn, rows, { inclImg: false });
    }
    return {
        total,
        limit: pagingQueryStr ? parsedQuery.limit : total,
        offset: pagingQueryStr ? parsedQuery.offset : 0,
        rows
    };
}

async function getOne(conn, id, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["id"], { id });
    orderTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `order` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    return rows[0] || null;
}

async function getOneByCustomerId(conn, customer_id, id, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["id", "customer_id"], { id, customer_id });
    orderTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `order` WHERE `id` = ? AND `customer_id` = ? AND `is_deleted` = ?',
        [data.id, data.customer_id, false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    return rows[0] || null;
}

async function createOne(conn, order) {
    let config = await configModel.getAll(conn);
    // validate items
    itemsValidator.validate(order);
    // validate customer and subscription
    if (order.customer_id) {
        let customer = await customerModel.getOne(conn, order.customer_id);
        if (!customer) {
            throw new HttpError({statusCode: 400, message: "customer not found." });
        }
        order.customer_email = customer.email;
        let subscription = await subscriptionModel.getOneActiveByCustomerID(conn, order.customer_id);
        if (subscription) {
            order.subscription_id = subscription.id;
            order.subscription_discount_percentage = config[configModel.SUBSCRIPTION_DISCOUNT_PERCENTAGE];
        }
    } else {
        order.customer_id = null;
        order.subscription_id = null
        order.subscription_discount_percentage = 0;
    }
    // validate coupon
    if (order.coupon_id) {
        let coupon = await couponModel.getOneActive(conn, order.coupon_id);
        if (!coupon) {
            throw new HttpError({statusCode: 400, message: "Invalid coupon." });
        }
        order.coupon_value = coupon.value;
        order.coupon_type = coupon.type;
    } else {
        order.coupon_id = null;
        order.coupon_value = 0;
        order.coupon_type = couponModel.PERCENTAGE_TYPE;
    }
    // init value from config
    order.shipping_fee = config[configModel.SHIPPING_FEE];
    order.sale_tax = config[configModel.SALE_TAX];
    order.status = 0;
    order.tracking = null;
    // validate other information
    let data = utils.objectAssign(
        [
            "customer_id",
            "customer_first_name",
            "customer_middle_name",
            "customer_last_name",
            "customer_email",
            "subscription_id",
            "subscription_discount_percentage",
            "coupon_id",
            "coupon_value",
            "coupon_type",
            "shipping_fee",
            "sale_tax",
            "tracking",
            "status",
            "shipping_address_1",
            "shipping_address_2",
            "shipping_address_city",
            "shipping_address_state",
            "shipping_address_zip",
            "billing_address_1",
            "billing_address_2",
            "billing_address_city",
            "billing_address_state",
            "billing_address_zip",
            "card_name",
            "card_number",
            "card_expire_month",
            "card_expire_year",
            "card_code"
        ], 
        order
    );
    orderTable.validate(data);
    // init and deep validate items
    let itemsHash = {};
    for (let item of order.items) {
        let itemData = utils.objectAssign(["product_id", "quantity"], item);
        orderProductModel.table.validate(itemData);
        if (!itemsHash[item.product_id]) {
            itemsHash[item.product_id] = item;
        } else {
            itemsHash[item.product_id].quantity = itemsHash[item.product_id].quantity + item.quantity;
        }
    }
    let itemsHashKeys = Object.keys(itemsHash);
    let products = await productModel.getManyByIds(conn, itemsHashKeys, { inclImg: false });
    if (products.length != itemsHashKeys.length) {
        throw new HttpError({statusCode: 400, message: "Invalid items." });
    }
    let productHash = {};
    for (let product of products) {
        productHash[product.id] = product;
    }
    for (let key of itemsHashKeys) {
        if (itemsHash[key].quantity > productHash[key].quantity) {
            throw new HttpError({statusCode: 400, message: "Invalid items." });
        }
    }
    // calculate total
    data.total_final = 0;
    // original total
    for (let key of itemsHashKeys) {
        data.total_final = data.total_final + productHash[key].price * itemsHash[key].quantity;
    }
    data.total_origin = data.total_final;
    // total subscription
    if (data.subscription_id) {
        data.total_subscription = data.total_final * data.subscription_discount_percentage;
        data.total_final = data.total_final - data.total_subscription;
    } else {
        data.total_subscription = 0;
    }
    // total coupon
    if (data.coupon_id) {
        switch(data.coupon_type) {
            case couponModel.PERCENTAGE_TYPE:
                data.total_coupon = data.total_final * data.coupon_value;
                data.total_final = data.total_final - data.total_coupon; 
                break;
            case couponModel.FIXED_AMOUNT_TYPE:
                data.total_coupon = data.coupon_value;
                data.total_final = data.total_final - data.total_coupon; 
                break;
        }
    } else {
        data.total_coupon = 0;
    }
    if (data.total_final < 0) {
        data.total_coupon = data.total_coupon + data.total_final;
        data.total_final = 0;
    }
    // shipping fee and sale tax
    data.total_final = data.total_final + data.shipping_fee;
    data.total_sale_tax = data.total_final * data.sale_tax;
    data.total_final = data.total_final + data.total_sale_tax;
    // payment successfully processed
    const [rows] = await conn.query(
        'INSERT INTO `order`('
        + '`customer_id`, '
        + '`customer_first_name`, '
        + '`customer_middle_name`, '
        + '`customer_last_name`, '
        + '`customer_email`, '
        + '`subscription_id`, '
        + '`subscription_discount_percentage`, '
        + '`coupon_id`, '
        + '`coupon_value`, '
        + '`coupon_type`, '
        + '`shipping_fee`, '
        + '`sale_tax`, '
        + '`total_origin`, '
        + '`total_subscription`, '
        + '`total_coupon`, '
        + '`total_sale_tax`, '
        + '`total_final`, '
        + '`tracking`, '
        + '`status`, '
        + '`shipping_address_1`, '
        + '`shipping_address_2`, '
        + '`shipping_address_city`, '
        + '`shipping_address_state`, '
        + '`shipping_address_zip`, '
        + '`billing_address_1`, '
        + '`billing_address_2`, '
        + '`billing_address_city`, '
        + '`billing_address_state`, '
        + '`billing_address_zip`, '
        + '`card_name`, '
        + '`card_number`, '
        + '`card_expire_month`, '
        + '`card_expire_year`, '
        + '`card_code`'
        + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            data.customer_id,
            data.customer_first_name,
            data.customer_middle_name,
            data.customer_last_name,
            data.customer_email,
            data.subscription_id,
            data.subscription_discount_percentage,
            data.coupon_id,
            data.coupon_value,
            data.coupon_type,
            data.shipping_fee,
            data.sale_tax,
            data.total_origin,
            data.total_subscription,
            data.total_coupon,
            data.total_sale_tax,
            data.total_final,
            data.tracking,
            data.status,
            data.shipping_address_1,
            data.shipping_address_2,
            data.shipping_address_city,
            data.shipping_address_state,
            data.shipping_address_zip,
            data.billing_address_1,
            data.billing_address_2,
            data.billing_address_city,
            data.billing_address_state,
            data.billing_address_zip,
            data.card_name,
            data.card_number,
            data.card_expire_month,
            data.card_expire_year,
            data.card_code
        ]
    );
    data.items = [];
    for (let key of itemsHashKeys) {
        data.items.push({
            order_id: rows.insertId,
            product_id: itemsHash[key].product_id,
            price: productHash[key].price,
            quantity: itemsHash[key].quantity
        });
    }
    await orderProductModel.createMany(conn, data.items);
    await productModel.updateManyQuantityByIds(conn, data.items.map(item => {
        return { 
            id: item.product_id, 
            quantity: -1 * item.quantity 
        };
    }));
    return rows.insertId;
}

async function updateOne(conn, newOrder) {
    let oldOrder = await getOne(conn, newOrder.id);
    if (!oldOrder) {
        throw new HttpError({statusCode: 400, message: `order not found.`});
    }
    let data = utils.objectAssign(["id", "tracking"], oldOrder, newOrder);
    orderTable.validate(data);
    if (!data.tracking) {
        data.status = PLACED_STATUS;
    } else {
        data.status = SHIPPED_STATUS;
    }
    const [rows] = await conn.query(
        'UPDATE `order` SET `tracking` = ?, `status` = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.tracking, data.status, data.id, false]
    );
    return data.id;
}

async function cancelOne(conn, newOrder) {
    let oldOrder = await getOne(conn, newOrder.id);
    if (!oldOrder) {
        throw new HttpError({statusCode: 400, message: `order not found.`});
    }
    let data = utils.objectAssign(["id"], oldOrder, newOrder);
    orderTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `order` SET `status` = ? WHERE `id` = ? AND `is_deleted` = ?',
        [CANCELLED_STATUS, data.id, false]
    );
    let items = await orderProductModel.getProductByOrderId(conn, data.id, { inclImg: false });
    await productModel.updateManyQuantityByIds(conn, items.map(item => {
        return { 
            id: item.product_id, 
            quantity: 1 * item.quantity 
        };
    }));
    return data.id;
}

export default {
    table: orderTable,
    prepare,
    getAll,
    getAllByCustomerId,
    getOne,
    getOneByCustomerId,
    createOne,
    updateOne,
    cancelOne,
    STATUS,
    CANCELLED_STATUS,
    PLACED_STATUS,
    SHIPPED_STATUS
}