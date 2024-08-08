const express = require('express');
const path = require('path');
const app = express();

app.set("hostname", "localhost");
app.set("port", 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"www")));
app.use('/', require("./routes/productTypesRoutes"));
app.use('/', require("./routes/productsRoutes"));
app.use('/', require("./routes/tablesRoutes"));
app.use('/', require("./routes/orderItemsRoutes"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(app.get("port"), () => {
    console.log(`\n Server Listening on ${app.get("port")}`)
});