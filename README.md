# node-contact-list

## MVC
It is an architectural pattern that divides an app into three main logical components: Modal, View, Controller.  
It is industry standard development framework to build scalable apps.  

### Models: 
It deals with the data related logic that a user requests.  
It contains all data/info that you display to the user.  
Model get all these data from database (and data can be RUD).  

### View: 
It includes HTML CSS JS.  
Using view user interacts with the website.  

### Controller: 
Interface between Model and View. It takes user inputs and perform interactions on the data Model objects.  

//express.js : web framework for node.js  
// writing our server using express.js  

```
const express = require('express')
const port = 8000

const app = express()

app.get('/', function(req,res){
	res.send("Homepage")
})
app.get('/profile', function(req,res){
	res.send("<h1>Profile</h1>")
})

app.listen(port, function(err){
  if(err){ console.log(err); }

  console.log("Server is up and running on port: ", port);
}
```

//now we're install ejs template engine for View of app  
```bash
npm install ejs
```
//we need to do three tasks now  
//set view engine to ejs  
//set views path to views(or whatever you made)  
//in get request, res.render('index.ejs')  
```
const express = require("express");
const path = require("path");
const port = 8000;

const app = express();

app.set(("view engine", "ejs"));
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  res.render("home.ejs");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server is up and running on port: ", port);
});
```

//now to pass dynamic data to the rendering pages  
//or do some logical things, wrap in <% %> normal js  
//if you're using var, then wrap in <%= %>  
```
res.render("home.ejs", { title: "Home Page!" });
```
in home.ejs file  
```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><%= title %></title>

  </head>
  <body>
    <h1>rendering from ejs</h1>
    <% for(let i=1; i<=10; i++){ %>
      <li><%= i %></li>
  <%  } %>
  </body>
</html>
```

//creating contact list  
//we'll first use hardcoded value to display  
```
const contactList = [
  {
    name: "Gaurav",
    phone: 123,
  },
  {
    name: "Adhkari",
    phone: 456,
  },
  {
    name: "Cool",
    phone: 789,
  },
];
```

//in home.ejs, create a form  
```
<form class="" action="/create-contact" method="POST">
      <input type="text" name="name" value="" placeholder="Enter name">
      <input type="number" name="phone" placeholder="Enter number" value="">
      <button type="submit" name="button">submit</button>
</form>
```
//back in index.js, we have to handle form submit  
//we can get values of requested page by express.urlencoded()  
```
app.use(express.urlencoded());

app.post('/create-post', function (req, res){
	//contactList.push({ name: req.body.name, phone: req.body.phone })
	contactList.push(req.body)
	return res.redirect('/')

}
```
//urlencoded is a middleware  
//middleware runs first as the page loads  

//to access static files we use static middleware  
```
app.use(express.static('assets'));
```
//in assets folder, create js css images folders  
//include these files in home.ejs  
```
<link rel="stylesheet' href="/css/home.css" />

<script type="text/javascript" src="/js/home.js"></script>
```
//deleting a contact  
//in home.ejs, make a query link  
```
    <div class="">
      <h1>Contact List</h1>
      <% for(let i of contact_list){ %>
        <ul>
          <li><%= i.name %></li>
          <li><%= i.phone %></li>
          <a href="/delete-contact/<%= i.phone %>"><button>Delete</button></a>
        </ul>
    <%  } %>
    </div>
```
//in index.js, we will make controller for that route  
```
app.get("/delete-contact/:phone", function (req, res) {
  let phone = req.params.phone;

  let array = contactList.filter((contact) => contact.phone != phone);
  contactList = array;
  return res.redirect("back");
});
```

//steps to connect to mongoDB  
1. Install MongoDB  
2. Install Robo 3T (to visualize data as GUI rather than terminal)  
3. Install Mongoose(object data modelling ODM for MongoDB)  
4. Setup Config  
5. Run server and test  
```bash
npm install mongoose
```
//instead of writing mongodb syntax directly, mongoose make our life easier  
//by giving simpler syntaxes  

//let's create config file for it  
```
config/mongoose.js

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/contact_list_db", {
  useNewUrlParser: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to mongodb");
});
```
//then require it inside index.js  
```
const db = require("./config/mongoose");
```
//till now we have done V & C, now we'll work on M part  
//create folder for models  
```
models/contact.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
```
//then require it inside index.js   
```
const Contact = require("./models/contact");
```

//now instead of pushing new contacts in create-contact controller  
//we'll push new contact to DB  

```
app.get('/create-contact', function(req, res){
	Contact.create({ req.body }, function(err, success){
		if(err){ return console.error(err)}
		console.log(success)
		res.redirect('back')
	})
})
```
//to display contacts from database  
```
app.get("/", function (req, res) {
  Contact.find({}, function (err, contacts) {
    if (err) {
      console.log(err);
      return;
    }
    return res.render("home.ejs", {
      title: "Contact List",
      contact_list: contacts,
    });
  });
});
```
//to delete contact from database  
//we will use query method instead of params here  
//in home.ejs file add query to url for id  
```
<a href='delete-contact/?id=<%= i._id %>'> Delete</a>

app.get("/delete", async function (req, res) {
  await Todo.deleteOne({ _id: req.query.id });
  return res.redirect("back");
});
```
