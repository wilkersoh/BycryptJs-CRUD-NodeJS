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

const bcrypt = require('bcryptjs')

const myFunction  = async () => {
    const password = "Red12345";
    // 密码和 route 8 || 10 都可以
    const hashPass = await bcrypt.hash(password, 8);

    console.log(password)
    console.log(hashPass);

    const isMatch = await bcrypt.compare('red12345', hashPass)
    console.log(isMatch);
}

myFunction();