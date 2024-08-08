var loadProductsPage = function () {
    getProducts(null, function(err, products) {
        if (err) {
            console.error(err);
        } else {
            productsPage(products);
        }
    });
}

var productsPage = function (products) {

    let getSelectedProduct = function () {
        let rows = Array.from(document.querySelectorAll(".products-table tr"));
        rows.shift();
        for (const row of rows)
            if (row.className == "row-selected") {
                let description = row.querySelector("td:first-child").textContent;
                return description;
            }
        return null;
    }

    let createProductsDiv = function () {

        clearElementChildren("products-container");

        // Products table
        let tableElement = document.createElement("table");
        tableElement.className = "products-table";
            // header
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let thDescription = document.createElement("th");
        let thType = document.createElement("th");
        let thPrice = document.createElement("th");
        thDescription.appendChild(document.createTextNode("Description"));
        thType.appendChild(document.createTextNode("Type"));
        thPrice.appendChild(document.createTextNode("Price"));
        tr.appendChild(thDescription);
        tr.appendChild(thType);
        tr.appendChild(thPrice);
        thead.appendChild(tr);
        tableElement.appendChild(thead);
            // rows
        var tbody = document.createElement('tbody');
        for (const product of products) {
            let tr = document.createElement("tr");
            tr.className = "row-unselected"
            tr.onclick = function() {
                rowClick(tr, tableElement);
            };
            let tdDescription = document.createElement("td");
            let tdType = document.createElement("td");
            let tdPrice = document.createElement("td");
            tdDescription.appendChild(document.createTextNode(product.description));
            tdType.appendChild(document.createTextNode(product.productType.name));
            tdPrice.appendChild(document.createTextNode(product.price.toFixed(2) + " €"));
            tr.appendChild(tdDescription);
            tr.appendChild(tdType);
            tr.appendChild(tdPrice);
            tbody.appendChild(tr);
        }
        tableElement.appendChild(tbody);
        productsContainer.appendChild(tableElement);

        // Buttons
        let buttonsDiv = document.createElement("div");
        let createButton = document.createElement("button");
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        createButton.textContent = "Create";
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";
        createButton.addEventListener('click', () => {
            getProductTypes(null, function(err, productTypes) {
                if (err) {
                    console.error(err);
                } else {
                    createActionsDiv(productTypes);
                }
            });
        });
        editButton.addEventListener('click', () => {
            let description = getSelectedProduct();
            if (description) {
                getProductTypes(null, function(err, productTypes) {
                    if (err) {
                        console.error(err);
                    } else {
                        let product = products.filter(product => product.description == description)[0];
                        createActionsDiv(productTypes, product);
                    }
                });
            } else {
                alert("You have to select an item!");
            }
        });
        deleteButton.addEventListener('click', () => {
            let description = getSelectedProduct();
            if (description) {
                let id = products.filter(product => product.description == description)[0].id;
                deleteProduct(id, function(err, data) {
                    if (err) {
                        if (JSON.stringify(err).includes("Unauthorized")) {
                            console.log("There are tables with this product!");
                        } else {
                            console.error(err);
                        }
                    } else {
                        loadProductsPage();
                    }
                });
            } else {
                alert("You have to select an item!");
            }
        });
        buttonsDiv.appendChild(createButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        productsContainer.appendChild(buttonsDiv);
    }

    let createActionsDiv = function (productTypes, selectedProduct) {

        clearElementChildren("actions-container");

        // Product description
        let descriptionDiv = document.createElement("div");
        let descriptionHeader = document.createElement("h3");
        descriptionHeader.textContent = "Descrição";
        let descriptionInput = document.createElement("input");
        descriptionInput.value = selectedProduct ? selectedProduct.description : "";
        descriptionDiv.appendChild(descriptionHeader);
        descriptionDiv.appendChild(descriptionInput);
        actionsContainer.appendChild(descriptionDiv);

        // Product type
        let typeDiv = document.createElement("div");
        let typeHeader = document.createElement("h3");
        typeHeader.textContent = "Tipo";
        let typeDropdown = document.createElement("select");
        let i = 1;
        for (const productType of productTypes) {
            let option = document.createElement("option");
            option.value = productType.id;
            option.text = productType.name;
            typeDropdown.appendChild(option);
        }
        if (selectedProduct)
            typeDropdown.value = selectedProduct.productType.id;
        typeDiv.appendChild(typeHeader);
        typeDiv.appendChild(typeDropdown);
        actionsContainer.appendChild(typeDiv);

        // Product price
        let priceDiv = document.createElement("div");
        let priceHeader = document.createElement("h3");
        priceHeader.textContent = "Preço";
        let priceInput = document.createElement("input");
        priceInput.value = selectedProduct ? selectedProduct.price : 0;
        priceDiv.appendChild(priceHeader);
        priceDiv.appendChild(priceInput);
        actionsContainer.appendChild(priceDiv);

        // Buttons
        let buttonsDiv = document.createElement("div");
        let saveButton = document.createElement("button");
        let cancelButton = document.createElement("button");
        saveButton.textContent = "Save";
        cancelButton.textContent = "Cancel";
        saveButton.addEventListener('click', () => {
            let description = descriptionInput.value.trim();
            let type = typeDropdown.value;
            let price = parseFloat(priceInput.value);

            // validations
            if (description == "")
                return;
            if (price <= 0)
                return;

            body = {
                product_description: description,
                type_id: type,
                product_price: price
            };

            if (!selectedProduct) {
                createProduct(body, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        loadProductsPage();
                    }
                });
            } else {
                changeProduct(selectedProduct.id, body, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        loadProductsPage();
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
    let productsContainer = document.createElement("div");
    let actionsContainer = document.createElement("div");

    container.className = "main-container";
    productsContainer.className = "products-container";
    actionsContainer.className = "actions-container";

    container.appendChild(productsContainer);
    container.appendChild(actionsContainer);
    main.appendChild(container);

    createProductsDiv();
}