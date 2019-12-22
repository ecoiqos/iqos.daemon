const iQOS = require("./lib/iqos");
const express = require("express");

const iqos = new iQOS();
const api = express();
const http = require('http').Server(api);
const io = require('socket.io')(http);
if (process.env.REPL) {
	const cli = require("repl").start("> ");
	cli.context.iqos = iqos;
}

api.get("/battery", (req, res) => {
	res.json(iqos.battery);
});

setInterval(() => {
	io.emit("battery", iqos.battery);
}, 150);

http.listen(1447);
