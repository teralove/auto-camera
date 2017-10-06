// OPCODE REQUIRED :
// - S_DUNGEON_CAMERA_SET
// - S_SPAWN_ME

module.exports = function CameraDistance(dispatch) {

	let enable = true
	let defaultDistance = 800
	let lastDistance = 0

	// command
	try {
		const Command = require('command')
		const command = Command(dispatch)
		command.add('camera', (distance) => {
			if (isNaN(distance)) {
				send(`[camera-distance] : <font color="#FF0000">Invalid argument.</font>`)
				return
			}
			setCamera(distance)
			send(`[camera-distance] : Distance set at <font color="#56B4E9">${distance}</font>.`)
		})
		function send(msg) {
			command.message(`<font color="#FFFFFF">` + msg + `</font>`)
		}
	} catch (e) {
		console.log(`[ERROR] -- camera-distance module --`)
	}
	
	// code
	dispatch.hook('S_SPAWN_ME', 1, function(event) {
		setTimeout(() => {
			// check on/off and if there is a previous distance set
			if (enable && lastDistance == 0) { lastDistance = defaultDistance }
			// maintain previous distance
			if (lastDistance != 0) { setCamera(lastDistance) }	
		}, 1000)
	})
	
	// helper
	function setCamera(distance) {
		lastDistance = distance;
		dispatch.toClient('S_DUNGEON_CAMERA_SET', {
			enabled: true,
			default: distance,
			max: distance
		})
	}
	
}
