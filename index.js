// Version 1.46 r:03

const Command = require('command')
const config = require('./config.json')

const DEFAULT_DISTANCE = config.defaultDistance

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }

module.exports = function AutoCamera(d) {
	const command = Command(d)

	let enable = config.enable

	let lastDistance = 0

	// code
	// check if there is no previous distance set
	// otherwise, maintain previous distance
	d.hook('S_SPAWN_ME', 'raw', () => {
		if (!enable) return
		if (lastDistance === 0) { lastDistance = DEFAULT_DISTANCE }
		setTimeout(() => { setCamera(lastDistance) }, 1000)
	})

	// helper
	function setCamera(distance) {
		lastDistance = distance
		d.toClient('S_DUNGEON_CAMERA_SET', { enabled: true, default: distance, max: distance })
	}

	// command
	command.add(['camera', 'cam'], (distance) => {
		// toggle
		if (!distance) {
			enable = !enable
			send(`${enable ? 'Enabled'.clr('56B4E9') : 'Disabled'.clr('E69F00')}`)
		}
		// set distance
		else if (!isNaN(distance)) {
			setCamera(distance)
			send(`Distance set at ` + `${distance}`.clr('56B4E9'))
		}
		else send(`Invalid argument.`.clr('FF0000'))
	})
	function send(msg) { command.message(`[auto-camera] : ` + msg) }

}
