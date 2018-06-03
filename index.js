// Version 1.46 r:07

const Command = require('command')
const config = require('./config.json')

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }

module.exports = function AutoCamera(d) {
	const command = Command(d)

	let enable = config.enable,
		setDistance = config.defaultDistance

	// code
	d.hook('S_SPAWN_ME', 'raw', () => {
		if (enable) setTimeout(() => { setCamera(setDistance) }, 1000)
	})

	// helper
	function setCamera(distance) {
		setDistance = distance
		d.send('S_DUNGEON_CAMERA_SET', 1, { 
			enabled: true,
			default: setDistance,
			max: distance
		})
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
