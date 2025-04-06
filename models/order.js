import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import customerModel from "./customer.js";
import configModel from "./config.js";
import couponModel from "./coupon.js";
import orderProductModel from "./orderProduct.js";
import productModel from "./product.js";
import Validator from "../helpers/validator.js";

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
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
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
    "tracking": {
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "status": {
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_1":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_2":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "shipping_address_city":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_state":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "shipping_address_zip":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_1":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_2":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "billing_address_city":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_state":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_zip":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_name":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_number":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_expire_month":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_expire_year":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_code":{ 
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
    sort: [],
    filter: {}
});

const itemsValidator = new Validator({
    items: {
        types: DataType.ARRAY(DataType.ANY()),
        isRequired: DataType.NOTNULL()
    }
})

async function getAll(conn) {
    const [rows] = [[]];
    return rows;
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    orderTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `order` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function createOne(conn, order) {
    let config = await configModel.getAll(conn);
    // items
    itemsValidator.validate(order);
    // customer and subscription
    if (order.customer_id) {
        let customer = await customerModel.getOne(conn, order.customer_id);
        if (!customer) {
            throw new HttpError({statusCode: 401 });
        }
        order.customer_email = customer.email;
        if (customer.subscription) {
            let subscription = customer.subscription;
            order.subscription_id = subscription.id;
            order.subscription_discount_percentage = config[configModel.SUBSCRIPTION_DISCOUNT_PERCENTAGE];
        }
    } else {
        order.customer_id = null;
        order.subscription_id = null
        order.subscription_discount_percentage = 0;
    }
    // coupon
    if (order.coupon_id) {
        let coupon = await couponModel.getOne(conn, order.coupon_id);
        if (!coupon) {
            throw new HttpError({statusCode: 400, message: "Invalid coupon." });
        }
        order.coupon_value = coupon.value;
        order.coupon_type = coupon.type;
    } else {
        order.coupon_id = null;
        order.coupon_value = 0;
        order.type = 0;
    }
    // other
    order.shipping_fee = config[configModel.SHIPPING_FEE];
    order.sale_tax = config[configModel.SALE_TAX];
    order.status = 0;
    order.tracking = null;
    let data = utils.objectAssign([
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
    // item
    let itemsHash = {};
    for (let item of order.items) {
        let itemData = utils.objectAssign(["product_id", "quantity"], item);
        orderProductModel.table.validate(itemData);
        if (!itemsHash[item.product_id]) {
            itemsHash[item.product_id] = item;
        } else {
            itemsHash[item.product_id] = itemsHash[item.product_id] + item.quantity;
        }
    }
    let itemsHashKeys = Object.keys(itemsHash);
    let products = await productModel.getManyByIds(conn, itemsHashKeys, false);
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
        + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    let insertIds = await orderProductModel.createMany(conn, data.items);
    let updateIds = await productModel.updateManyQuantityByIds(conn, data.items.map(item => {
        return { id: item.product_id, quantity: item.quantity };
    }));
    return rows.insertId;
}

export default {
    getAll,
    getOne,
    createOne
}