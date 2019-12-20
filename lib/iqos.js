const { bluetooth } = require("webbluetooth");
const debug = require("debug")("iqos");

class iQOS {
	constructor() {
		this.device = null;
		this.bootstraped = false;

		this.services = {
			UUID_RRP_SERVICE: {
				uuid: "daebb240-b041-11e4-9e45-0002a5d5c51b",
				UUID_BATTERY_INFORMATION: {
					uuid: "f8a54120-b041-11e4-9be7-0002a5d5c51b"
				}
			}
		}

		this.battery = {
			holder: null,
			case: null
		};

		this.bootstrap()
			.then((...args) => {
				debug("bootstrap", "done", ...args);
			})
			.catch((error) => {
				debug("bootstrap", "error", error);
				throw new Error(error);
			})
	}

	async bootstrap() {
		try {
			this.device = await bluetooth.requestDevice({
				acceptAllDevices: true,
				filters: [{ services: ["daebb240-b041-11e4-9e45-0002a5d5c51b"] }]
			});
			this.gattServer = await this.device.gatt.connect();
		} catch (error) {
			if (error) throw new Error(error);
			else return true;
		}
	}
}

module.exports = iQOS;
