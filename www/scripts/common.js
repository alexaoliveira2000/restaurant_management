var getTables = function (callback) {
    console.log("GET /tables");
    $.ajax({
        url: '/tables',
        method: 'GET',
        success: function(data) {
            console.log('tables:', data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error obtaining tables:', error);
            callback(error, null);
        }
    });
}

var getTableProducts = function (id, callback) {
    console.log("GET /order-items/" + id);
    $.ajax({
        url: '/order-items/' + id,
        method: 'GET',
        success: function(data) {
            console.log('table products:', data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error obtaining table products:', error);
            callback(error, null);
        }
    });
}

var getProducts = function (id, callback) {
    let url = "/products/";
    url += id || "";
    console.log("GET " + url);
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            console.log('products:', data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error obtaining products:', error);
            callback(error, null);
        }
    });
}

var deleteProductsFromTable = function (id, product, callback) {
    let url = "/order-items/" + id + "/";
    url += product || "";
    console.log("DELETE " + url);
    $.ajax({
        url: url,
        method: 'DELETE',
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error deleting table product:', error);
            callback(error, null);
        }
    });
}

var closeTable = function (id, callback) {
    console.log("PUT /tables/" + id);
    $.ajax({
        url: '/tables/' + id,
        method: 'PUT',
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error closing table:', error);
            callback(error, null);
        }
    });
}

var createTableProduct = function (id, body, callback) {
    console.log("POST /order-items/" + id);
    $.ajax({
        url: "/order-items/" + id,
        method: 'POST',
        data: body,
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error creating table product:', error);
            callback(error, null);
        }
    });
}

var changeTableProductQuantity = function (id, body, callback) {
    console.log("PUT /order-items/" + id);
    $.ajax({
        url: "/order-items/" + id,
        method: 'PUT',
        data: body,
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error changing table product quantity:', error);
            callback(error, null);
        }
    });
}

var getProducts = function (id, callback) {
    let url = "/products/";
    url += id || "";
    console.log("GET " + url);
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            console.log('products:', data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error obtaining products:', error);
            callback(error, null);
        }
    });
}

var getProductTypes = function (id, callback) {
    let url = "/product-types/";
    url += id || "";
    console.log("GET " + url);
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            console.log('product types:', data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error obtaining product types:', error);
            callback(error, null);
        }
    });
}

var deleteProduct = function (id, callback) {
    let url = "/products/" + id;
    console.log("DELETE " + url);
    $.ajax({
        url: url,
        method: 'DELETE',
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error deleting product:', error);
            callback(error, null);
        }
    });
}

var createProduct = function (body, callback) {
    console.log("POST /products/");
    $.ajax({
        url: "/products/",
        method: 'POST',
        data: body,
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error creating product:', error);
            callback(error, null);
        }
    });
}

var changeProduct = function (id, body, callback) {
    console.log("PUT /products/" + id);
    $.ajax({
        url: "/products/" + id,
        method: 'PUT',
        data: body,
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error changing product:', error);
            callback(error, null);
        }
    });
}

var deleteProductType = function (id, callback) {
    let url = "/product-types/" + id;
    console.log("DELETE " + url);
    $.ajax({
        url: url,
        method: 'DELETE',
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error deleting product type:', error);
            callback(error, null);
        }
    });
}

var createProductType = function (body, callback) {
    console.log("POST /product-types/");
    $.ajax({
        url: "/product-types/",
        method: 'POST',
        data: body,
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error creating product:', error);
            callback(error, null);
        }
    });
}

var changeProductType = function (id, body, callback) {
    console.log("PUT /product-types/" + id);
    $.ajax({
        url: "/product-types/" + id,
        method: 'PUT',
        data: body,
        success: function(data) {
            console.log(data);
            callback(null, data);
        },
        error: function(xhr, status, error) {
            console.error('Error changing product:', error);
            callback(error, null);
        }
    });
}

var rowClick = function (tr) {
    let rows = Array.from(document.querySelectorAll(".products-table tr"));
    rows.shift();
    for (const row of rows)
        row.className = row == tr ? "row-selected" : "row-unselected";
}

var clearElementChildren = function (elementClassName, elementType) {
    let element = document.getElementsByClassName(elementClassName)[0];
    let node = element.firstChild;
    while (node) {
        let tempNode = node.nextSibling;
        if (!elementType || node.tagName === elementType) {
            element.removeChild(node);
        }
        node = tempNode;
    }
}

var deepCopy = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}