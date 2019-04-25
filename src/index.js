const express = require('express');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json())

// routes
app.use('/', require('./routes/user'));


app.listen(port, () => {
    console.log('Server is connected ' + port);
})


