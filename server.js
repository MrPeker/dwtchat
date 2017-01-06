/**
 * Created by Mehmet Ali Peker on 07.12.2016.
 */

var express = require("express");
var app = express();

var server = app.listen(8080);
var io = require("socket.io").listen(server);
var path = require("path");

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


io.sockets.on("connection",function (socket) {

    socket.on("gonder",function (data) {
        data.socketID = socket.id;
        data.yazi = escapeHtml(data.yazi);
        data.user = escapeHtml(data.user);
        io.emit("alici",data);

    });

    socket.on('disconnect', function(){
        if(socket.name != undefined){
            var ayrildiData = socket.name + ' adlı kullanıcı odadan ayrıldı.';
            console.log(ayrildiData);
            io.sockets.emit("ayrildi", ayrildiData);
        }
    });

    socket.on('reconnect', function(){
        var reConnectData = socket.name + ' adlı kullanıcı yeniden bağlandı.' + socket.id;
        console.log(reConnectData);
        io.sockets.emit("reconnected", reConnectData);
    });

    socket.on('join', function (name) {
        socket.name = escapeHtml(name);
        console.log(socket.name + ' adlı kullanıcı odaya katıldı.');
        var katildiData = socket.name + ' adlı kullanıcı odaya katıldı.';
        io.sockets.emit("katildi", katildiData);
    });


});

app.use(express.static(path.join(__dirname, 'public')));


app.get("/beta",function (req, res) {

    res.sendFile(path.join(__dirname+"/beta/index.html"));


});

app.get("/", function (req, res) {

   res.sendFile(path.join(__dirname+"/alpha/index.html"));

});