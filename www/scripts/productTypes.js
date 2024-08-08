var loadProductTypesPage = function () {
    getProductTypes(null, function(err, productTypes) {
        if (err) {
            console.error(err);
        } else {
            productTypesPage(productTypes);
        }
    });
}

var productTypesPage = function (productTypes) {

    let getSelectedProductType = function () {
        let rows = Array.from(document.querySelectorAll(".products-table tr"));
        rows.shift();
        for (const row of rows)
            if (row.className == "row-selected") {
                let type = productTypes.filter(type => type.name == row.querySelector("td:first-child").textContent)[0];
                return type;
            }
        return null;
    }

    let createProductTypesDiv = function () {

        clearElementChildren("products-container");

        // Product Types table
        let tableElement = document.createElement("table");
        tableElement.className = "products-table";
            // header
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let thType = document.createElement("th");
        thType.appendChild(document.createTextNode("Description"));
        tr.appendChild(thType);
        thead.appendChild(tr);
        tableElement.appendChild(thead);
            // rows
        var tbody = document.createElement('tbody');
        for (const type of productTypes) {
            let tr = document.createElement("tr");
            tr.className = "row-unselected"
            tr.onclick = function() {
                rowClick(tr, tableElement);
            };
            let tdType = document.createElement("td");
            tdType.appendChild(document.createTextNode(type.name));
            tr.appendChild(tdType);
            tbody.appendChild(tr);
        }
        tableElement.appendChild(tbody);
        productTypesContainer.appendChild(tableElement);

        // Buttons
        let buttonsDiv = document.createElement("div");
        let createButton = document.createElement("button");
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        createButton.textContent = "Create";
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        createButton.addEventListener('click', () => {
            createActionsDiv(productTypes);
        });
        editButton.addEventListener('click', () => {
            let type = getSelectedProductType();
            if (type) {
                createActionsDiv(productTypes, type);
            } else {
                alert("You have to select an item!");
            }
        });
        deleteButton.addEventListener('click', () => {
            let type = getSelectedProductType();
            if (type) {
                deleteProductType(type.id, function(err, data) {
                    if (err) {
                        if (JSON.stringify(err).includes("Unauthorized")) {
                            console.log("There are products of this type!");
                        } else {
                            console.error(err);
                        }
                    } else {
                        loadProductTypesPage();
                    }
                });
            } else {
                alert("You have to select an item!");
            }
        });
        buttonsDiv.appendChild(createButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        productTypesContainer.appendChild(buttonsDiv);
    }

    let createActionsDiv = function (productTypes, selectedType) {

        clearElementChildren("actions-container");

        // Type description
        let descriptionDiv = document.createElement("div");
        let descriptionHeader = document.createElement("h3");
        descriptionHeader.textContent = "Description";
        let descriptionInput = document.createElement("input");
        descriptionInput.value = selectedType ? selectedType.name : "";
        descriptionDiv.appendChild(descriptionHeader);
        descriptionDiv.appendChild(descriptionInput);
        actionsContainer.appendChild(descriptionDiv);

        // Buttons
        let buttonsDiv = document.createElement("div");
        let saveButton = document.createElement("button");
        let cancelButton = document.createElement("button");
        saveButton.textContent = "Save";
        cancelButton.textContent = "Cancel";
        saveButton.addEventListener('click', () => {
            let description = descriptionInput.value.trim();

            // validations
            if (description == "")
                return;

            body = { type_name: description };

            if (!selectedType) {
                createProductType(body, function(err, data) {
                    if (err) {
                        if (JSON.stringify(err).includes("Unauthorized")) {
                            console.log("There are types of products with this description!");
                        } else {
                            console.error(err);
                        }
                    } else {
                        loadProductTypesPage();
                    }
                });
            } else {
                changeProductType(selectedType.id, body, function(err, data) {
                    if (err) {
                        if (JSON.stringify(err).includes("Unauthorized")) {
                            console.log("There are types of products with this description!");
                        } else {
                            console.error(err);
                        }
                    } else {
                        loadProductTypesPage();
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
    let productTypesContainer = document.createElement("div");
    let actionsContainer = document.createElement("div");

    container.className = "main-container";
    productTypesContainer.className = "products-container";
    actionsContainer.className = "actions-container";

    container.appendChild(productTypesContainer);
    container.appendChild(actionsContainer);
    main.appendChild(container);

    createProductTypesDiv();
}