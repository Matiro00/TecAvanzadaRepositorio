const express = require('express');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });
const conexion = require('./db/db');
const socketio = require('socket.io');
const formatearMensaje = require('./public/clases/mensajes.js')
const { unirseUsuario, getUsuariosPorId, usuarioAbandona, getRoomUsuarios } = require('./public/clases/usuarios')
const app = express();
var body = require('body-parser')

const http = require('http');
const server = http.createServer(app);
const io = socketio(server);


const PORT = 3000
let user = ''
let room = ''



app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.set('view engine', 'ejs');

server.listen(PORT, () => {
    console.log("TODO ANDANDO EN : http://localhost:" + PORT);
})




io.on('connection', socket => {

    socket.on('unirseSala', () => {
        const usuario = unirseUsuario(socket.id, user, room);
        socket.join(usuario.room)
        socket.emit('alerta', formatearMensaje('Server:', `Bienvenido ${usuario.nombre}`))
        socket.broadcast.to(usuario.room).emit('alerta', formatearMensaje('Server:', `Chicos entro ${usuario.nombre}, dejen de hablar mal de el`));
        io.to(usuario.room).emit('usuariosEnRoom',getRoomUsuarios(usuario.room))

        socket.on('disconnect', () => {
            const usuario = usuarioAbandona(socket.id)
            if (user) {
                io.to(usuario.room).emit('alerta', formatearMensaje('Server:', `${usuario.nombre} por suerte ya se fue.`))
                io.to(usuario.room).emit('usuariosEnRoom',getRoomUsuarios(usuario.room))
                
            }
        })

        socket.on('mensaje', (msg) => {
            if (msg != '') {
                io.to(usuario.room).emit('mensaje', formatearMensaje(usuario.nombre, msg));
            }
        })
    })



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
app.get('/home', (req, res) => {
    if (req.session.logeado) {
        conexion.query('SELECT * FROM rooms ', async (error, result, field) => {
            res.render('rooms', {
                name: user,
                rooms: result
            });
        })
    }
    else {
        res.redirect('/login');
    }
})
app.get('/room/', (req, res) => {
    room = req.query.room;
    if (req.session.logeado) {
        res.render('index', {
            name: user,
            room: room
        });
    }
    else {
        res.redirect('/login');
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        user = ''
        room = ''
        res.redirect('/login');
    })
})


app.post('/auth', async (req, res) => {
    let name = req.body.user;
    let contrasena = req.body.password;
    let password = await bcryptjs.hash(contrasena, 8);
    if (name && contrasena) {
        conexion.query('SELECT * FROM users WHERE name = ?', [name], async (error, result, field) => {
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
                req.session.logeado = true;
                user = result[0].name;
                res.render('login', {
                    alert: true,
                    alertTitle: "Confirmacion",
                    alertMessage: "Bienvenido " + user,
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

