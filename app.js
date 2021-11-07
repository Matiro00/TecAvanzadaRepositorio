const express = require('express');
const app = express();
const http =require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });




app.use('/public', express.static(__dirname + '/public'));




app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');



app.use(session({
    secret: '123',
    resave: true,
    saveUninitialized: true
}))
const conexion = require('./db/db');
const { Socket } = require('socket.io');




//socket


io.on('connection',(socket)=>{
    socket.on('mensaje',(msg)=>io.emit('mensaje',msg))

    app.post('/auth', async (req, res) => {
        let name = req.body.user;
        let contrasena = req.body.password;
        let password = await bcryptjs.hash(contrasena, 8);
        if (name && contrasena) {
            conexion.query('SELECT * FROM users WHERE name = ?', [name], async (error, result,field) => {
                if (result.length == 0 || !(await bcryptjs.compare(contrasena, result[0].password))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrecta",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
    
                }
                else {
                    req.session.logeado=true;
                    req.session.name=result[0].name;
                    socket.user = result[0].name;
                    io.emit('mensaje',"SERVER: El usuario "+ socket.user +" se ha conectado");
                    res.render('login', {
                        alert: true,
                        alertTitle: "Confirmacion",
                        alertMessage: "Bienvenido " + socket.user,
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: ''
                    });
                }
            })
        }
    
        else {
            res.render('login', {
                alert: true,
                alertTitle: "Cuidado!",
                alertMessage: "Debe ingresar usuario y contraseña",
                alertIcon: 'warning',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }
    })
    
})







server.listen(777,()=>{
    console.log("TODO ANDANDO EN : http://localhost:777");
})

app.get('', (req, res) => {
    res.redirect('/home');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/register', (req, res) => {
    res.render('register');
})



app.post('/register', async (req, res) => {
    let name = req.body.user;
    let contrasena = req.body.password;
    let password = await bcryptjs.hash(contrasena, 8);
    conexion.query('INSERT INTO users SET ?', { name: name, password: password }, async (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.render('register', {
                alert: true,
                alertTitle: "Confirmacion",
                alertMessage: "La registracion se hizo exitosamente",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2000,
                ruta: 'login'
            }

            )
        }
    }
    )
})

app.get('/home',(req,res)=>{
    if(req.session.logeado){
        res.render('index',{
            login:true,
            name: req.session.name
        });
    }
    else{
        res.redirect('/login');
    }
})

app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login');
    })
})