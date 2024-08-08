const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/products/:id?", function (req, res) {
    const id = req.params.id;
    Product.getProduct(id, function (err, product) {
        if (err) {
            res.status(500).json(err);
        } else if (!product) {
            res.sendStatus(404);
        } else {
            res.status(200).json(product);
        }
    });
});

router.put("/products/:id", function (req, res) {
    const id = req.params.id;
    const body = req.body;
    Product.updateProduct(id, body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post("/products/", function (req, res) {
    let body = req.body;
    if (!body.product_description || !body.type_id || !body.product_price) {
        res.sendStatus(400);
    }
    body = {
        product_description: body.product_description,
        type_id: body.type_id,
        product_price: body.product_price
    };
    Product.addProduct(body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            res.status(200).json(result.insertId);
        }
    });
});

router.delete("/products/:id", function (req, res) {
    const id = req.params.id;
    Product.deleteProduct(id, function (err, result) {
        if (err) {
            if (err.code.includes('ROW_IS_REFERENCED')) {
                res.status(401).json(err);
            } else {
                res.status(500).json(err);
            }
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;