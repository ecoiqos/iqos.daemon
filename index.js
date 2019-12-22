const iQOS = require("./lib/iqos");
const express = require("express");

const iqos = new iQOS();
const api = express();
if (process.env.REPL) {
	const cli = require("repl").start("> ");
	cli.context.iqos = iqos;
}

api.get("/battery", (req, res) => {
	res.json(iqos.battery);
});

api.listen(1447);
