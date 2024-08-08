const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

router.get("/order-items/:table", function (req, res) {
    const id = req.params.table;
    Table.getOrderItems(id, function (err, orderItems) {
        if (err) {
            res.status(500).json(err);
        } else if (!orderItems) {
            res.sendStatus(404);
        } else {
            res.status(200).json(orderItems);
        }
    });
});

router.put("/order-items/:id", function (req, res) {
    const id = req.params.id;
    let body = req.body;
    if (!body.product_id || !body.quantity) {
        res.sendStatus(400);
    }
    body = {
        product_id: body.product_id,
        quantity: body.quantity
    };
    Table.deleteProductFromTable(id, body.product_id, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            Table.addProductToTable(id, body, function (err, result) {
                if (err) {
                    res.status(500).json(err);
                } else if (!result.affectedRows) {
                    res.sendStatus(204);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.post("/order-items/:table", function (req, res) {
    const id = req.params.table;
    let body = req.body;
    if (!body.product_id || !body.quantity || body.quantity <= 0) {
        res.sendStatus(400);
    }
    body = {
        product_id: body.product_id,
        quantity: body.quantity
    };
    Table.openTable(id, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            Table.addProductToTable(id, body, function (err, result) {
                if (err) {
                    res.status(500).json(err);
                } else if (!result.affectedRows) {
                    res.sendStatus(204);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.delete("/order-items/:id", function (req, res) {
    const id = req.params.id;
    Table.deleteProductsFromTable(id, null, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            Table.closeTable(id, function (err, result) {
                if (err) {
                    res.status(500).json(err);
                } else if (!result.affectedRows) {
                    res.sendStatus(204);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.delete("/order-items/:id/:product", function (req, res) {
    const id = req.params.id;
    const product = req.params.product;
    Table.deleteProductsFromTable(id, product, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            Table.closeTable(id, function (err, result) {
                if (err) {
                    res.status(500).json(err);
                } else if (!result.affectedRows) {
                    res.sendStatus(204);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

module.exports = router;