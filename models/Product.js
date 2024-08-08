const connection = require("../config/connection");
const ProductType = require("../models/ProductType");

class Product {
      constructor (obj) {
            this.id = obj.product_id;
            this.description = obj.product_description;
            this.productType = new ProductType(obj);
            this.price = obj.product_price;
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
    
        static getProduct(id, callBack) {
            let sql = `
                  SELECT p.*, t.type_name
                  FROM rest_products p
                  JOIN rest_types t ON p.type_id = t.type_id
            `;
            const params = [];
        
            if (id) {
                sql += " WHERE product_id = ?";
                params.push(id);
            }
        
            Product.queryDb(sql, params, function (err, result) {
                if (err) {
                    callBack(err, null);
                } else if (result.length === 0) {
                    callBack(null, null);
                } else {
                    callBack(null, result.map(row => new Product(row)));
                }
            });
        }

        static addProduct(values, callBack) {
            const keys = Object.keys(values);
            const placeholders = keys.map(() => '?').join(', ');
            const columns = keys.join(', ');
            const sql = `INSERT INTO rest_products (${columns}) VALUES (${placeholders})`;

            Product.queryDb(sql, Object.values(values), function (err, result) {
                if (err) {
                    callBack(err, null);
                } else {
                    callBack(null, result);
                }
            });
        }

        static updateProduct(id, newValues, callBack) {
            let sql = "UPDATE rest_products SET ";
            const params = [];
            
            Object.keys(newValues).forEach(key => {
                sql += `${key} = ?, `;
                params.push(newValues[key]);
            });
            sql = sql.slice(0, -2);
            
            sql += " WHERE product_id = ?";
            params.push(id);
            
            Product.queryDb(sql, params, function (err, result) {
                if (err) {
                    callBack(err, null);
                } else {
                    callBack(null, result);
                }
            });
        }

        static deleteProduct(id, callBack) {
            let sql = "DELETE FROM rest_products WHERE product_id = ?";
            const params = [id];
            Product.queryDb(sql, params, function (err, result) {
                if (err) {
                    callBack(err, null);
                } else {
                    callBack(null, result);
                }
            });
        }
      
}

module.exports = Product;