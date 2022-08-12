const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/router');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/files', express.static('files'));

app.use(routes);

let PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log("Server is up and listening on port: "+PORT);
});
