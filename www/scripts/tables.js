var loadTablesPage = function (selectedTableId) {
    getTables(function(err, tables) {
        if (err) {
            console.error(err);
        } else {
            tablesPage(tables, selectedTableId);
        }
    });
}

var tablesPage = function (tables, selectedTableId) {

    let tableClick = function (number, tablesElements) {
        for (i in tables) {
            let table = tables[i];
            if (table.isSelected || i == number - 1)
                table.isSelected = !table.isSelected;
            tablesElements[i].className = table.isSelected ? "selected" : table.state;
        }
    }

    let getSelectedProductDescription = function () {
        let rows = Array.from(document.querySelectorAll(".products-table tr"));
        rows.shift();
        for (const row of rows)
            if (row.className == "row-selected") {
                let description = row.querySelector("td:first-child").textContent;
                return description;
            }
        return null;
    }

    let createTableElement = function (table, tablesElements, isSelected) {
        let button = document.createElement("button");
        button.textContent = table.number;
        button.id = table.number;
        button.className = isSelected ? "selected" : table.state;
        button.addEventListener('click', () => {
            clearElementChildren("products-container");
            tableClick(table.number, tablesElements);
            if (table.isSelected) {
                loadTableProductsPage(table);
            }
        });
        if (isSelected) {
            table.isSelected = true;
            loadTableProductsPage(table);
        }
        return button;
    }

    let loadTableProductsPage = function (table) {
        getTableProducts(table.number, function(err, data) {
            if (err) {
                console.error(err);
            } else {
                createTableProductsDiv(table, data);
            }
        });
    }

    let createTableProductsDiv = function (table, tableProducts) {

        clearElementChildren("products-container");
        clearElementChildren("actions-container");

        // Table nº ...
        let tableNumberHeader = document.createElement("h2");
        tableNumberHeader.textContent = "Table " + table.number;
        productsContainer.appendChild(tableNumberHeader);

        // Products table
        let tableElement = document.createElement("table");
        tableElement.className = "products-table";
            // header
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let thDescription = document.createElement("th");
        let thQuantity = document.createElement("th");
        let thValue = document.createElement("th");
        thDescription.appendChild(document.createTextNode("Product"));
        thQuantity.appendChild(document.createTextNode("Quantity"));
        thValue.appendChild(document.createTextNode("Value"));
        tr.appendChild(thDescription);
        tr.appendChild(thQuantity);
        tr.appendChild(thValue);
        thead.appendChild(tr);
        tableElement.appendChild(thead);
            // rows
        var tbody = document.createElement('tbody');
        for (const product of tableProducts) {
            let tr = document.createElement("tr");
            tr.className = "row-unselected"
            tr.onclick = function() {
                rowClick(tr, tableElement);
            };
            let tdDescription = document.createElement("td");
            let tdQuantity = document.createElement("td");
            let tdValue = document.createElement("td");
            tdDescription.appendChild(document.createTextNode(product.description));
            tdQuantity.appendChild(document.createTextNode(product.quantity));
            tdValue.appendChild(document.createTextNode(product.price.toFixed(2) + " €"));
            tr.appendChild(tdDescription);
            tr.appendChild(tdQuantity);
            tr.appendChild(tdValue);
            tbody.appendChild(tr);
        }
        tableElement.appendChild(tbody);
        productsContainer.appendChild(tableElement);

        // Total
        let totalHeader = document.createElement("h2");
        let total = tableProducts.reduce((accumulator, product) => accumulator + product.price * product.quantity, 0);
        totalHeader.textContent = "Total " + total.toFixed(2) + " €";
        productsContainer.appendChild(totalHeader);

        // Buttons
        let buttonsDiv = document.createElement("div");
        let createButton = document.createElement("button");
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        let closeButton = document.createElement("button");
        createButton.textContent = "Create";
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";
        closeButton.textContent = "Close";

        createButton.addEventListener('click', () => {
            getProducts(null, function(err, products) {
                if (err) {
                    console.error(err);
                } else {
                    createActionsDiv(table, products);
                }
            });
        });
        editButton.addEventListener('click', () => {
            let description = getSelectedProductDescription();
            if (description) {
                let product = tableProducts.filter(product => product.description == description);
                createActionsDiv(table, product, product[0]);
            } else {
                alert("You have to select an item!");
            }
        });
        deleteButton.addEventListener('click', () => {
            let description = getSelectedProductDescription();
            if (description) {
                let id = tableProducts.filter(product => product.description == description)[0].id;
                deleteProductsFromTable(table.number, id, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        getTableProducts(table.number, function(err, data) {
                            if (err) {
                                console.error(err);
                            } else {
                                if (data.length == 0) {
                                    closeTable(table.number, function(err, data) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            loadTablesPage(table.number);
                                        }
                                    });
                                } else {
                                    loadTableProductsPage(table);
                                }
                            }
                        });
                        
                    }
                });
            } else
                alert("You have to select an item!");
        });
        closeButton.addEventListener('click', () => {
            deleteProductsFromTable(table.number, null, function(err, data) {
                if (err) {
                    console.error(err);
                } else {
                    closeTable(table.number, function(err, data) {
                        if (err) {
                            console.error(err);
                        } else {
                            table.isSelected = false;
                            loadTablesPage(table.number);
                        }
                    });
                }
            });
        });
        buttonsDiv.appendChild(createButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(closeButton);
        productsContainer.appendChild(buttonsDiv);
    }

    let createActionsDiv = function (table, products, selectedProduct) {

        clearElementChildren("actions-container");

        // Product
        let productDiv = document.createElement("div");
        let productHeader = document.createElement("h2");
        productHeader.textContent = "Product";
        let productDropdown = document.createElement("select");
        let i = 1;
        for (const product of products) {
            let option = document.createElement("option");
            option.value = product.id;
            option.text = product.description;
            productDropdown.appendChild(option);
            i++;
        }
        productDiv.appendChild(productHeader);
        productDiv.appendChild(productDropdown);
        actionsContainer.appendChild(productDiv);

        // Quantity
        let quantityDiv = document.createElement("div");
        let quantityHeader = document.createElement("h2");
        quantityHeader.textContent = "Quantity";
        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = selectedProduct ? selectedProduct.quantity : 1;
        quantityDiv.appendChild(quantityHeader);
        quantityDiv.appendChild(quantityInput);
        actionsContainer.appendChild(quantityDiv);

        // Buttons
        let buttonsDiv = document.createElement("div");
        let saveButton = document.createElement("button");
        let cancelButton = document.createElement("button");
        saveButton.textContent = "Save";
        cancelButton.textContent = "Cancel";
        saveButton.addEventListener('click', () => {
            let productId = productDropdown.value;
            let quantity = parseInt(quantityInput.value);
            // validations
            if (quantity <= 0)
                return

            let body = { product_id: productId, quantity: quantity};
            if (!selectedProduct) {
                createTableProduct(table.number, body, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        loadTablesPage(table.number);
                    }
                });
            } else {
                changeTableProductQuantity(table.number, body, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        loadTablesPage(table.number);
                    }
                });
            }
        });
        cancelButton.addEventListener('click', () => {
            clearElementChildren("actions-container");
        });
        buttonsDiv.appendChild(saveButton);
        buttonsDiv.appendChild(cancelButton);
        actionsContainer.appendChild(buttonsDiv);
    }

    clearElementChildren("main");

    let main = document.getElementsByClassName("main")[0];

    let container = document.createElement("div");
    let tablesContainer = document.createElement("div");
    let productsContainer = document.createElement("div");
    let actionsContainer = document.createElement("div");

    container.className = "main-container";
    tablesContainer.className = "tables-container";
    productsContainer.className = "products-container";
    actionsContainer.className = "actions-container";

    let tablesElements = []
    for (const table of tables) {
        let isSelected = selectedTableId ? table.number == selectedTableId : false;
        let element = createTableElement(table, tablesElements, isSelected);
        tablesElements.push(element);
        tablesContainer.appendChild(element);
    }

    container.appendChild(tablesContainer);
    container.appendChild(productsContainer);
    container.appendChild(actionsContainer);
    main.appendChild(container);
}