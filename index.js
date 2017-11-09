// OPCODE REQUIRED :
// - S_DUNGEON_CAMERA_SET
// - S_SPAWN_ME

const Command = require('command')

module.exports = function CameraDistance(dispatch) {

	const command = Command(dispatch)

	let enable = true
	let defaultDistance = 800
	let lastDistance = 0

	// command
	try {
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
	} catch (e) {
		console.log(`[ERROR] -- camera-distance module --`)
	}

	// command chat function
	function send(msg) {
		command.message(`[camera-distance] : ` + msg)
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
		try {
			dispatch.toClient('S_DUNGEON_CAMERA_SET', {
				enabled: true,
				default: distance,
				max: distance
			})
		} catch (e) {
			enable = false
			send(`Unmapped protocol : <font color="#FF0000">S_DUNGEON_CAMERA_SET</font><font>. module is now </font><font color="#E69F00">disabled</font><font>.</font>`)
		}
	}
	
}
