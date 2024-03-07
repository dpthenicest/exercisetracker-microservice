const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const crypto = require('crypto');

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

const users = [];

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Router to handle POST request to create and retrieve users data
app.post('/api/users', (req, res) => {
  const username = req.body.username;

  const hash = crypto.createHash('sha256');
  hash.update(username);
  const id = hash.digest('hex').substr(0, 8);

  const user = ({username: username, _id: id});
  users.push(user);
  
  res.json(user);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

// Route to handle POST request submission and retrieval of a user object
app.post('/api/users/:_id/exercises', (req, res) => {
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  const _id = req.params._id;
  const dateObject = new Date(date);
  const dateStringFormat = dateObject.toString();

  const log = {dateStringFormat, duration, description};
  let counter;
  let username;

  users.forEach(user => {
    // Check if the current object has the search value
  if (Object.values(user).includes(_id)) {
    // If _id is found, push data into the log array
    username = user.username;
    if (!user.log || !Array.isArray(user.log)) {
      // If log doesn't exist or is not an array, initialize it as an empty array
      user.log = [log];
    } else {
      // Push data into the k2 array
      user.log.push(log);
    }
    // if count doesn't exist, it is created. else it is incremented by 1
    if(!user.count){
      user.count = 1;
      counter = user.count;
    } else {
      user.count = user.count + 1;
      counter = user.count;
    }
  }
  });

  res.json({_id: _id, username: username, date: dateStringFormat, duration: duration, description: description});
})

// Route to handle GET request to retrieve users' exercise logs
app.get('/api/users/:_id/logs', (req, res) => {
  // Extract parameters from URL
  const userId = req.params._id;
  const { from, to, limit } = req.query;

  // Function to find a user by _id
  const foundUser = users.find(user => {
    return user._id == _id;
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
