var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')

var user = require('./users').user

var app = express();

function checkUser(name, password) {
    return (name === user.name) && (password === user.password)
}

app.set('view engine','ejs');
app.set('views', __dirname);

//add bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    cookie: {
        path: '/', 
        httpOnly: true, 
        secure: false, 
        maxAge: 60 * 1000
    },
    secret: 'test',
    resave: false,
    saveUninitialized: false
}))


app.get('/', (req, res) => {
    var userID = req.session.userID;
    //!! 等价于 Boolean
    var isLogined = !!userID;

    res.render('index', {
        isLogined: isLogined,
        name: userID || ''
    });
})

app.post('/login', (req, res) => {
    var isUser = checkUser(req.body.name, req.body.password)

    if(isUser) {
        req.session.regenerate((err) => {
            if(err) return res.json({res_code: 2, res_msg: "登录失败"})
            req.session.userID = user.name
            res.json({
                res_code: 0,
                res_msg: "登陆成功"
            })
        })
    } else {
        res.json({
            res_code: 1,
            res_msg: "账号或者密码错误"
        })
    }
}) 

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})
  
app.listen(80);