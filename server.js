import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mercadopago from 'mercadopago';
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname + "/public")))
mercadopago.configure({
    access_token: 'APP_USR-4576210767707316-122115-6ff85cb3e8b50bbda47a0af6be9cd861-18504467'
});

let orders = [{
  title: "",
  unit_price: 0,
  quantity: 1,
}]

let preference = {
  items: [],
  back_urls: {
    success: "http://localhost:3000/paydone",
    failure: "http://localhost:3000/feedback",
    pending: "http://localhost:3000/feedback",
  },
  auto_return: "approved",
};



app.get('/orders', (req, res) => {
    res.send(orders);
})

app.post('/order', (req, res) => {
    const order = req.body;
    orders[0].title = orders[0].title + ', ' + order.title
    orders[0].unit_price = orders[0].unit_price + order.unit_price
    res.send("Order created");
})
app.post('/pay', (req, res) => {
  addOrdertoPreferences(orders);
  endPayment();
  res.send(preference);
})
app.post('/feedback', (req, res) => {
  deletePreference();
  res.send("Feedback received");
})

function addOrdertoPreferences(order) {
  preference.items = [];
  preference.items = order;
  orders = [{
    title: "",
    unit_price: 0,
    quantity: 1,
  }]
}
function endPayment() {
  mercadopago.preferences.create(preference).then(function(response) {
    preference = response.response;
  });
}
function deletePreference() {
  preference = {
    items: [],
    back_urls: {
      success: "http://localhost:3000/paydone",  
      failure: "http://localhost:3000/feedback",
      pending: "http://localhost:3000/feedback",
    },
    auto_return: "approved",
  }
}

app.get('/checkout/preference', (req, res) => {
  res.send(res.status(200).json(preference));
});

app.get("/checkout/preferences", (req, res) => {
  let createPref = mercadopago.preferences
  res.send(res.status(200).json(createPref));
})

// app.get('/', (req, res) => {
//     res.send('MP DB');
// });
// app.all('/*', (req, res, next) => {
//     res.send('That route does not exist!');
// });

app.listen(port);

