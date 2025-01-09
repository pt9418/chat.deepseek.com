const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// 中间件
app.use(bodyParser.json());

// 用户数据存储
let users = [];

// 注册接口
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: '用户名已存在' });
    }

    // 添加新用户
    users.push({ username, password });
    res.status(201).json({ message: '注册成功' });
});

// 检查登录状态接口
app.get('/check-login', (req, res) => {
    // 模拟已登录用户
    if (users.length > 0) {
        return res.json({ username: users[0].username });
    }
    res.status(404).json({ error: '未登录' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
