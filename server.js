const express = require('express');
const webPush = require('web-push');

const app = express();
const port = process.env.PORT || 3000;

// it should be saved on data base
let subscriptions = [];

// it must be on server environment variables
const PUBLIC_KEY = 'BKkMmIDYejXIYo4jFeuiGj_NYzdpQeg-V5oy1bQGyIIFafl_ZksuorHX0VIKAJOEDetoAFhhg2GT1c0gt4ma3g8';
const PRIVATE_KEY = 'oMsfBW-PuZiX4LjNoI4bGQ-9bDtQI24u_c5X7PGd6O4';

webPush.setVapidDetails(
  'mailto:lfdantoni@gmail',
  PUBLIC_KEY,
  PRIVATE_KEY
);

app.use(express.static('client'));
app.use(express.json());


app.post('/api/subscribe', (req, resp) => {
  const newSubscription = req.body;
  const newSubStr = JSON.stringify(newSubscription);

  const exist = subscriptions.find(sub => {
    return JSON.stringify(sub) === newSubStr;
  })

  if(!exist) {
    console.log('New subscription', newSubscription)
    subscriptions.push(req.body);
  }

  resp.status(201).send({message: 'Subscription added'})
})

// it should have a security mechanism
app.post('/api/notification', (req, resp) => {
  subscriptions.forEach(sub => {
    webPush.sendNotification(sub, JSON.stringify({
      title: 'Test',
      options: {
        body: req.body.message,
        icon: 'images/icon512.png',
      }
    }))
  })

  resp.status(201).send({message: 'Notification sent'})
})

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})
