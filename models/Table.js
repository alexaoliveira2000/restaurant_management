const connection = require("../config/connection");
const Product = require("../models/Product");

class Table {
    constructor(obj) {
        this.number = obj.table_id;
        this.state = obj.table_state;
    }

    static queryDb(sql, params, callBack) {
        const mysqlCon = connection();
        mysqlCon.query(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
        mysqlCon.end();
    }

    static getTables(callBack) {
        let sql = "SELECT * FROM rest_tables";
        const params = [];
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else if (result.length === 0) {
                callBack(null, null);
            } else {
                callBack(null, result.map(row => new Table(row)));
            }
        });
    }
    
    static getOrderItems(id, callBack) {

        let aggregateProducts = function (products) {
            const aggregatedProducts = {};
            products.forEach(product => {
                const { id, description, productType, price } = product;
                const key = `${id}-${description}-${productType.id}-${price}`;
                
                if (!aggregatedProducts[key]) {
                    aggregatedProducts[key] = { ...product, quantity: 1 };
                } else {
                    aggregatedProducts[key].quantity++;
                }
            });
            return Object.values(aggregatedProducts);
        }
        
        let sql = `
            SELECT p.product_id, p.product_description, p.type_id, p.product_price, tt.type_name
            FROM rest_tables t
            JOIN rest_tables_products tp ON t.table_id = tp.table_id
            JOIN rest_products p ON tp.product_id = p.product_id
            JOIN rest_types tt ON p.type_id = tt.type_id
            WHERE t.table_id = ?;
        `;
        const params = [id];
    
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else if (!result || result.length === 0) {
                callBack(null, []);
            } else {
                let products = result.map(row => new Product(row));
                callBack(null, aggregateProducts(products));
            }
        });
    }

    static addProductToTable(id, body, callBack) {
        let sql = "INSERT INTO rest_tables_products (table_id, product_id) VALUES ";
        let values = [];
        let placeholders = "(?, ?)";
        let params = [];
        for (let i = 0; i < body.quantity; i++) {
            values.push(placeholders);
            params.push(id, body.product_id);
        }
        sql += values.join(", ");
    
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }
    
    static deleteProductsFromTable(id, product, callBack) {
        let sql = "DELETE FROM rest_tables_products WHERE table_id = ?";
        const params = [id];
        if (product) {
            sql += " AND product_id = ?";
            params.push(product);
        }
        
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }

    static deleteProductFromTable(table_id, product_id, callBack) {
        let sql = "DELETE FROM rest_tables_products WHERE table_id = ? AND product_id = ?";
        const params = [table_id, product_id];
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }
    
    static openTable(id, callBack) {
        let sql = "UPDATE rest_tables SET table_state = 'open' WHERE table_id = ?";
        const params = [id];
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }
    
    static closeTable(id, callBack) {
        let sql = "UPDATE rest_tables SET table_state = 'closed' WHERE table_id = ?";
        const params = [id];
        Table.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }

}

module.exports = Table;