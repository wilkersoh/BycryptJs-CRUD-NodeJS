const express = require('express');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

// routes
app.use('/', require('./routes/user'));


app.listen(port, () => {
    console.log('Server is connected ' + port);
})


const jwt = require('jsonwebtoken');

const myFunction = () =>{
    // object and string, expiresIn: days || week || second 
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
    console.log(token)
    // token want to verify, ""
    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data);
}

myFunction();
