const express = require("express");
const path = require("path");
const port = 8000;

const db = require("./config/mongoose");
const Contact = require("./models/contact");

const app = express();

app.set(("view engine", "ejs"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));

let contactList = [
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

app.get("/profile", function (req, res) {
  res.render("profile.ejs", {
    title: "Profile Page",
    contact_list: contactList,
  });
});

app.post("/create-contact", function (req, res) {
  //contactList.push(req.body);
  Contact.create({ name: req.body.name, phone: req.body.phone }, function (
    err,
    newContact
  ) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(newContact);
    return res.redirect("back");
  });
});

app.get("/delete-contact", function (req, res) {
  //app.get("/delete-contact/:phone", function (req, res) {
  // let phone = req.params.phone;

  let id = req.query.id;
  // let array = contactList.filter((contact) => contact.phone != phone);
  // contactList = array;
  Contact.findByIdAndDelete(id, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    return res.redirect("back");
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server is up and running on port: ", port);
});
