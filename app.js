var express = require('express');
var app = express();
var shell = require('shelljs');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
app.use(express.static('public'));
console.log('Server created on port 80. Access it here http://localhost');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var serverList = [
    {
        title: 'Hello',
        link: 'Testing',
        status: 'connected'
    },
    {
        title: 'Hello 1',
        link: 'Testing',
        status: 'disconnected'
    },
    {
        title: 'Hello',
        link: 'Testing',
        status: 'disconnected'
    }
];
io.on('connection', function (socket) {

    function emitCCTVServerList() {
        socket.emit('cctvServerList',
            serverList
        ).broadcast.emit('cctvServerList',
            serverList
        );
    }
    emitCCTVServerList();

    socket.on('addCCTVToServerList', function (data) {
        serverList = data;
        emitCCTVServerList();
    });

});