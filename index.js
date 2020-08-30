const contents = {};

const httpServer = require('http').createServer((req, res) => {
    const url = (!req.url || req.url === '/') ? '/index.html' : req.url;
    if (typeof contents[url] === "undefined") {
        const filePath = __dirname + url;
        if (!require('fs').existsSync(filePath)) {
            contents[url] = '';
        } else {
            contents[url] = require('fs').readFileSync(__dirname + url, 'utf8')
        }
    }

    res.end(contents[url]);
});

const clientToRooms = {};

const io = require('socket.io')(httpServer);

io.on('connect', socket => {
    socket.emit('rooms', Object.keys(clientToRooms));
    socket.on('createRoom', function () {
        var ns = '/' + socket.id;
        socket.join(socket.id);

        var nsp = io.of(ns);
        clientToRooms[ns] = nsp;

        // set up what to do on connection
        nsp.on('connection', function (nsSocket) {
            console.log('someone connected');

            nsSocket.on('Info', function (data) {
                // just an example
            });
        });
    });

  socket.on('connectToRoom', function (roomId) {
    socket.join(roomId);
  });
});

httpServer.listen(3000, () => {
    console.log('go to http://localhost:3000');
});
