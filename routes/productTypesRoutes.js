const express = require("express");
const router = express.Router();
const ProductType = require("../models/ProductType");

router.get("/product-types/:id?", function (req, res) {
    const id = req.params.id;
    ProductType.getProductTypes(id, function (err, productType) {
        if (err) {
            res.status(500).json(err);
        } else if (!productType) {
            res.sendStatus(404);
        } else {
            res.status(200).json(productType);
        }
    });
});

router.put("/product-types/:id", function (req, res) {
    let id = req.params.id;
    let body = req.body;
    if (!body.type_name) {
        res.status(400).json("Body field are incorrect.");
    }
    body = { type_name: body.type_name };
    ProductType.updateProductType(id, body, function (err, result) {
        if (err) {
            if (err.code.includes('DUP_ENTRY')) {
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

router.post("/product-types/", function (req, res) {
    let body = req.body;
    if (!body.type_name) {
        res.status(400).json("Body field are incorrect.");
    }
    body = { type_name: body.type_name };
    ProductType.addProductType(body, function (err, result) {
        if (err) {
            if (err.code.includes('DUP_ENTRY')) {
                res.status(401).json(err);
            } else {
                res.status(500).json(err);
            }
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            res.status(200).json(result.insertId);
        }
    });
});

router.delete("/product-types/:id", function (req, res) {
    const id = req.params.id;
    ProductType.deleteProductType(id, function (err, result) {
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