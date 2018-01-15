// OPCODE REQUIRED :
// - S_DUNGEON_CAMERA_SET
// - S_SPAWN_ME

// Version 1.45 r:01

const DEFAULT_DISTANCE = 800

module.exports = function AutoCamera(d) {

	let enable = false,
		lastDistance = 0

	// code
	d.hook('S_SPAWN_ME', () => {
		if (!enable) return
		// check if there is no previous distance set
		// otherwise, maintain previous distance
		if (lastDistance === 0) { lastDistance = DEFAULT_DISTANCE }
		setTimeout(() => { setCamera(lastDistance) }, 1000)
	})

	// helper
	function setCamera(distance) {
		lastDistance = distance
		d.toClient('S_DUNGEON_CAMERA_SET', {
			enabled: true,
			default: distance,
			max: distance
		})
	}

	// command
	try {
		const Command = require('command')
		const command = Command(d)
		command.add(['camera', 'cam'], (distance) => {
			if (!distance) {
				enable = !enable
				send(`${enable ? 'enabled'.clr('56B4E9') : 'disabled'.clr('E69F00')}` + `.`.clr('FFFFFF'))
			}
			else if (!isNaN(distance)) {
				setCamera(distance)
				send(`Distance set at ` + `${distance}`.clr('56B4E9') + `.`.clr('FFFFFF'))
			}
			else send(`Invalid argument.`.clr('FF0000'))
		})
		function send(msg) { command.message(`[auto-camera] : ` + [...arguments].join('\n\t - ')) }
	} catch (e) { console.log(`[ERROR] -- auto-camera module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
