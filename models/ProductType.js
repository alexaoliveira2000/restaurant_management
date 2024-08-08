const connection = require("../config/connection");

class ProductType {
    constructor(obj) {
        this.id = obj.type_id;
        this.name = obj.type_name;
    }

    toString() {
        return `${this.name}`;
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

    static getProductTypes(id, callBack) {
        let sql = "SELECT * FROM rest_types";
        const params = [];
    
        if (id) {
            sql += " WHERE type_id = ?";
            params.push(id);
        }
    
        ProductType.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else if (result.length === 0) {
                callBack(null, null);
            } else {
                callBack(null, result.map(row => new ProductType(row)));
            }
        });
    }

    static addProductType(values, callBack) {
        const keys = Object.keys(values);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        const sql = `INSERT INTO rest_types (${columns}) VALUES (${placeholders})`;
        
        ProductType.queryDb(sql, Object.values(values), function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }

    static updateProductType(id, values, callBack) {
        let sql = "UPDATE rest_types SET ";
        const params = [];
        
        Object.keys(values).forEach(key => {
            sql += `${key} = ?, `;
            params.push(values[key]);
        });
        sql = sql.slice(0, -2);
        
        sql += " WHERE type_id = ?";
        params.push(id);
        
        ProductType.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }
    
    static deleteProductType(id, callBack) {
        let sql = "DELETE FROM rest_types WHERE type_id = ?";
        const params = [id];
        ProductType.queryDb(sql, params, function (err, result) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, result);
            }
        });
    }

}

module.exports = ProductType;