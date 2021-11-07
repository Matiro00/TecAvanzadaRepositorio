

let socket = null
const app = new Vue({
    el: '#app',
    data: {
        mensaje: '',
        mensajes: [],
        user: ''
    },
    methods: {
        enviarMensaje: function () {
            socket.emit('mensaje', this.mensaje)
            this.mensaje = ''
        },
    },
    created: function () {
        socket = io();
    },
    mounted: function () {
        socket.on('mensaje', function (mensaje) {
            app.mensajes.push(mensaje);
            app.$nextTick(function () {
                var mensajeBox = document.getElementById('chat');
                mensajeBox.scrollTop = mensajeBox.scrollHeight;
            })
        })
    }
});