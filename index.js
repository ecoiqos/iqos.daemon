const iQOS = require("./lib/iqos");
const express = require("express");

const iqos = new iQOS();
const api = express();

api.get("/battery", (req, res) => {
	res.json(iqos.battery);
});

api.listen(1447);
