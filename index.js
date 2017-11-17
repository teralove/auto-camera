// OPCODE REQUIRED :
// - S_DUNGEON_CAMERA_SET
// - S_SPAWN_ME

const DEFAULT_DISTANCE = 800

module.exports = function CameraDistance(dispatch) {

	let enable = true,
		lastDistance = 0

	// code
	dispatch.hook('S_SPAWN_ME', function (event) {
		if (!enable) return
		setTimeout(() => {
			// check on/off and if there is a previous distance set
			if (enable && lastDistance == 0) { lastDistance = DEFAULT_DISTANCE }
			// maintain previous distance
			if (lastDistance != 0) { setCamera(lastDistance) }
		}, 1000)
	})

	// helper
	function setCamera(distance) {
		lastDistance = distance
		dispatch.toClient('S_DUNGEON_CAMERA_SET', {
			enabled: true,
			default: distance,
			max: distance
		})
	}

	// command
	try {
		const Command = require('command')
		const command = Command(dispatch)
		command.add('camera', (distance) => {
			if (distance === undefined) {
				enable = !enable
				send(`${enable ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'}<font>.</font>`)
				return
			}
			if (isNaN(distance)) {
				send(`<font color="#FF0000">Invalid argument.</font>`)
				return
			}
			setCamera(distance)
			send(`Distance set at <font color="#56B4E9">${distance}</font><font>.</font>`)
		})
		function send(msg) {
			command.message(`[camera-distance] : ` + msg)
		}
	} catch (e) {
		console.log(`[ERROR] -- camera-distance module --`)
	}

}
