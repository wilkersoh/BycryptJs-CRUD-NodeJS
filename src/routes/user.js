const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/users', async (req, res)=> {

    try {
        const users = await User.find({});
        res.send(users);
    } catch(e){
        res.status(500).send();
    }
})

router.get('/users/:id',async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) {return res.status(404).send()}

        res.send(user)

    } catch (error) {
        res.status(500).send();
    }
})


router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try{
    await user.save()
    // const token = await user.generateAuthToken();
    res.status(201).send(user);
  } catch(e){
    res.status(400).send(e);
  }

})

// login  MAtch email and password same
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send( { user, token } );
    } catch (e){
        res.status(400).send();
    }
})

router.patch('/users/:id', async(req, res) => {
    // 做一个 custom 过滤 
    // Object.keys object turn to Array but only keys
    const updates = Object.keys(req.body)
    // 只能更新 以下 
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    // 每个要更新的updates都是true的话 执行  allwed 然后看他们 match 里面的吗 不 match就不update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        const user = await User.findById(req.params.id);
        // ["name","email","password","age"] database
        updates.forEach(update => user[update] = req.body[update]);

        await user.save();

        // req.body 是update的值
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true});
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send();
        }

        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
})

module.exports = router
