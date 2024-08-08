const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

router.get("/tables", function (req, res) {
    Table.getTables(function (err, tables) {
        if (err) {
            res.status(500).json(err);
        } else if (!tables) {
            res.sendStatus(404);
        } else {
            res.status(200).json(tables);
        }
    });
});

router.put("/tables/:id", function (req, res) {
    const id = req.params.id;
    Table.closeTable(id, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (!result.affectedRows) {
            res.sendStatus(204);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;