const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');


router.get('/users/me', auth, async (req, res)=> {
    // 通过 auth 验证 user 是不是正确的 
    res.send(req.user);
})

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try{
    await user.save()
    // Create id的时候 也做 token
    const token = await user.generateAuthToken();
    res.status(201).send({ user , token});
  } catch(e){
    console.log(e)
    res.status(400).send(e);
  }

})

// login  MAtch email and password same
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    // 只logout一个 设备的 而不是全部
    try {
        req.user.tokens = req.user.tokens.filter( token => {
            // 一样就排除 就代表 把token 拿掉 就出去了
            return token.token !== req.token
        })
        await req.user.save()

        res.send();
    } catch(e){
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
    } catch {
        res.status(500).send(); 
    }
})



router.patch('/users/me', auth , async(req, res) => {
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
        // ["name","email","password","age"] database
        updates.forEach(update => req.user[update] = req.body[update]);

        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();

        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
})

module.exports = router
