const http = require('http');
const fs = require('fs');
const express = require('express');

//express app
const app = express();

//listen for requests
app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./views/tictactoe.html', {root: __dirname});
});

//404 page //should be present at the bottom
app.use((req, res) => {
    res.sendFile('./views/404.html',{root: __dirname});
});

// if any get request is excecuted, then it doesn't execute the rest of the code