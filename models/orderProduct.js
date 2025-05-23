import DataType from "../helpers/dataType.js";
import Table from "../helpers/table.js";
import utils from "../helpers/utils.js";
import Validator from "../helpers/validator.js";
import productModel from "./product.js";

const orderProductTable = new Table("order_product", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "order_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "product_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "price": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "quantity": {
        type: DataType.NUMBER(),
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

async function getProductByOrderId(conn, order_id, opt = {}) {
    opt = utils.objectAssign(["include", "inclImg"], { include: false, inclImg: true }, opt);
    let data = utils.objectAssign(["order_id"], { order_id });
    orderProductTable.validate(data);
    const [rows] = await conn.query(
        'SELECT `order_product`.* FROM `product` INNER JOIN `order_product` ON `order_product`.`product_id` = `product`.`id` WHERE `order_product`.`order_id` = ?',
        [data.order_id, false]
    );
    if (opt.include) {
        for (let row of rows) {
            row.product = await productModel.getOne(conn, row.product_id, { inclImg: opt.inclImg });
        }
    }
    return rows;
}

async function createMany(conn, items) {
    let query = [];
    let param = [];
    let productIds = [];
    for (let item of items) {
        let data = utils.objectAssign(["order_id", "product_id", "price", "quantity"], item);
        orderProductTable.validate(data);
        query.push('(?, ? , ?, ?)');
        param.push(data.order_id, data.product_id, data.price, data.quantity);
        productIds.push(data.product_id);
    }
    let products = await productModel.getManyByIds(conn, productIds, { inclImg: false });
    if (products.length != productIds.length) {
        throw new HttpError({statusCode: 400, message: "Invalid items." });
    }
    const [rows] = await conn.query(
        'INSERT INTO `order_product`(`order_id`, `product_id`, `price`, `quantity`) VALUES ' + query.join(","),
        param
    );
    return rows;
}

export default {
    table: orderProductTable,
    getProductByOrderId,
    createMany
}