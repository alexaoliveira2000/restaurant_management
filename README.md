# How do I run it?

This is a complete and yet simple Node.js project of a Restaurant Management web application, with a front end (HTML & CSS) and back end (server and database).

This project can be used to understand how a server (Express - Node.js) can provide information to the user and change the database (MySQL) as needed.

To run this project:

1- Make sure you have Node.js and MySQL installed on your computer;
2- Download folder and open it in some IDE (e.g., VSCode);
3- Change file "config/connection.js" to your MySQL parameters;
3- In MySQL, run "queries.sql" code to create the relational database (tables and connections) and some dummy records;
3- Open new terminal;
4- Run command "npm install" to create folder "node_modules" and install all needed packages;
5- Run command "node app.js" to start running the server;
6- Open "localhost:3000" on your browser.

# Database

If you successfully followed the previous steps, you can see a not-so-pretty website to manage a restaurant. You can change the products on each table, change the products, and their types. Assuming we're working with a relational database, we need at least 3 database tables: Product Type, Product and Table. Each Product has a specific Product Type, making it a one to one connection. However, each Table can have several Products and each Product can be on several Tables (many-to-many connection), therefore, we need an intermediate table storing the products present on each table. I'm not going to go into more detail, as you can see all the code in "queries.sql".

Each entity contains a class, as shown in folder "models", each with methods to access and change the database if needed.

One big advantage of relational databases, especially for this case, is that if you change the price of a product, for example, all tables with that product will have the price automatically updated (because in reality all tables are pointing to the same product!).

## Server

On simple terms, a server simply provides some kind of service to a user. Usually, on a website, the server is tasked with sending database information to the user when he requests it (through a GET request), and changing the database information when he requests it (through an INSERT, UPDATE or DELETE request). When the server sends information to the user, it usually is in JSON (try acessing "localhost:3000/products"). "Why?" you ask. Because the only job of the server is to give the basic information to the user, not make the information pretty (since this can be done by the user browser). The user may not want to see this information through a web page.

To understand what kind of request is being made at each user action, on the browser terminal (press F12) it shows the history of requests, and the information returned by the server in JSON. When a user accesses a link directly through the search bar, it is automatically a GET request. All other types of request demand other actions, such as the click of a button. triggering a function which makes a request (this is possible through something called AJAX).

The server has to be "listening" at all moments for any of these requests and act accordingly, therefore, on folder "routes" you can find all kinds of requests that the server is expecting to receive, and you can see what it is doing on each one of them. Each request naturally has different kinds of validation (e.g., if you're trying to delete something that does not exist, it returns an error).

When you start the server, you're only really running the file "app.js", nothing more. When you enter "localhost:3000", you're triggering the request GET "/", which returns the "index.html" file, as you can see in "app.js".

## Front End

The front end can be seen as everything that is given to the user, from the JSON information given by the server to the HTML, CSS and JavaScript functions that present this information on a prettier way. If you access "Sources" when in F12, you can see that the user only has access to folder "scripts" (all JavaScript functions that trigger requests or simple user interactions, like changing the current page) and "styles" (CSS styles). This is done through Node.js as a security measure, as you do not want any user to have access to folder "config" (to access DB information) or "routes" (to exploit missing validations on behalf of the server).