let connect = function() {
    const mysql = require('mysql');
    const mysqlCon = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "12345",
        database: "restaurant"
    });
    mysqlCon.connect(function (err) {
        if (err) {
            console.log(err.message);
        }
    });
    return mysqlCon;
}

module.exports = connect;