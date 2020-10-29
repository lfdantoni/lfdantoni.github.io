const express = require('express');
const webPush = require('web-push');

const app = express();
const port = process.env.PORT || 3001;

// it should be saved on data base
let subscriptions = [];

// it must be on server environment variables
const PUBLIC_KEY = 'BKh8bd6cQKlrngFGcewcosHe6CShnxQ8ppNx6QGQFSLToV1wZOaM31RbkoChHw7-b0sST7fhv9L1HqbNuAL1aPg';
const PRIVATE_KEY = 'Q7xp93kF1_7hLAvM-QgIxMWsP-FBYr83oq-apb-5PmU';

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
  console.log('Sending notification...');

  // const notificationPayload = {
  //   title: 'Test',
  //   options: {
  //     body: 'Test body'
  //   }
  // }

  const notificationPayload = {
    title: 'Test' || req.body.title,
    options: {
      body: 'Test body',
      icon: '/images/icon512.png',
      image: 'https://miro.medium.com/max/1920/1*TXYc1qWqJo8oNFkXmsfGjg.jpeg',
      badge: 'https://raw.githubusercontent.com/gauntface/web-push-book/master/static/demos/notification-examples/images/badge-128x128.png',
      actions: [
        {
          action: 'coffee-action',
          title: 'Coffee',
          icon: 'https://raw.githubusercontent.com/gauntface/web-push-book/master/static/demos/notification-examples/images/action-1-128x128.png',
        },
        {
          action: 'doughnut-action',
          title: 'Doughnut',
          icon: 'https://raw.githubusercontent.com/gauntface/web-push-book/master/static/demos/notification-examples/images/action-2-128x128.png',
          data: {
            link: '/#/about'
          }
        }
      ],
      data: {
        link: '/#/about'
      },
      ...req.body.options
    },
    
  }

  subscriptions.forEach(sub => {

    webPush.sendNotification(sub, JSON.stringify(notificationPayload))
    

    // webPush.sendNotification(sub, JSON.stringify({
    //   title: req.body.title || 'Test',
    //   options: {
    //     body: 'default body',
    //     icon: 'images/icon512.png',
    //     ...req.body.options,
    //   }
    // }))
  })

  resp.status(201).send({message: 'Notification sent'})
})

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})
