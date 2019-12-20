const { bluetooth } = require("webbluetooth");
const debug = require("debug")("iqos");

class iQOS {
	constructor() {
		this.device = null;
		this.bootstraped = false;

		this.services = {
			UUID_RRP_SERVICE: {
				service: null,
				uuid: "daebb240-b041-11e4-9e45-0002a5d5c51b",
				UUID_BATTERY_INFORMATION: {
					characteristic: null,
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
				filters: [{ services: [this.services.UUID_RRP_SERVICE.uuid] }]
			});
			this.gattServer = await this.device.gatt.connect();
			this.services.UUID_RRP_SERVICE.service = await this.gattServer.getPrimaryService(this.services.UUID_RRP_SERVICE.uuid);
			this.services.UUID_RRP_SERVICE.UUID_BATTERY_INFORMATION.characteristic = await this.services.UUID_RRP_SERVICE.service.getCharacteristic(this.services.UUID_RRP_SERVICE.UUID_BATTERY_INFORMATION.uuid);
			const firstRead = await this.services.UUID_RRP_SERVICE.UUID_BATTERY_INFORMATION.characteristic.readValue();
			debug("device:read:firstRead", firstRead);
			this.handleUUID_BATTERY_INFORMATION(firstRead);

		} catch (error) {
			if (error) throw new Error(error);
			else this.bootstraped = true; return true;
		}
	}
	handleUUID_BATTERY_INFORMATION(value) {
		debug("device:read:handleBatteryCharacteristic", value, value.buffer.toString());
		const rawData = new Uint8Array(value.buffer);
		debug("device:read:handleBatteryCharacteristic:transformed", rawData);
		this.batteryCharacteristicRawData = rawData;
		if (value.byteLength === 7) {
			debug("device:read:handleBatteryCharacteristic:holder:isInside", true);
			let isHolderCharged = rawData[6];
			this.battery.holder = isHolderCharged == 100 ? 'charged' : 'charging';
			let caseCharge = rawData[2];
			this.battery.case = caseCharge;
			debug("device:read:handleBatteryCharacteristic:holder:isHolderCharged", isHolderCharged);
			debug("device:read:handleBatteryCharacteristic:case:caseCharge", caseCharge);
		} else {
			debug("device:read:handleBatteryCharacteristic:holder:isInside", false);
			let caseCharge = rawData[2];
			this.battery.case = caseCharge;
			this.battery.holder = false;
			debug("device:read:handleBatteryCharacteristic:case:caseCharge", caseCharge);
		}
	}
}

module.exports = iQOS;
