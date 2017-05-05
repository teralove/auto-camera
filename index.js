//vers 1.1

const format = require('./format.js');		//thank you fps-utils...

const OVERRIDE_DEFAULT_SETTINGS = false;
const DEFAULT_MAX_DISTANCE = 1200;			// Use this distance override on start when OVERRIDE_DEFAULT_SETTINGS = true

module.exports = function CameraDistance(dispatch) {
	
	let lastDistance = 0;
		
    dispatch.hook('S_SPAWN_ME', 1, function(event) {
		/*
		Camera settings get reset everytime the player respawns. Setting the camera distance immediatley on spawns doesn't work.
		A lame workaround is to delay the dispatch by a second. Might have to increase time delay on slower connections...
		*/
		setTimeout(() => {
			if (OVERRIDE_DEFAULT_SETTINGS && lastDistance == 0) {
				lastDistance = DEFAULT_MAX_DISTANCE;
			}
		
			// update camera settings if distance has been changed, else keep the original camera behavior.
			if (lastDistance != 0) {
				doCameraDispatch(lastDistance);
			}	
		}, 1000);
	})
	
	function doCameraDispatch(distance)	{
		if (isNaN(distance)) return;
		lastDistance = distance;
		
		dispatch.toClient('S_DUNGEON_CAMERA_SET', {
			enabled: true,
			default: distance,		// set the current viewing distance
			max: distance			// set the maximum scrolling range
		});
	}
		
    dispatch.hook('C_CHAT', 1, function(event) {
		let command = format.stripTags(event.message).split(' ');

		if(command[0] === '!camera') {
			if (command.length > 1) {
				doCameraDispatch(parseInt(command[1]));
			}
			return false;			
		}
	});	
	
	// slash support, thanks to wuaw for snippet
	try {
		const Slash = require('slash')
		const slash = new Slash(dispatch)
		slash.on('camera', args => doCameraDispatch(parseInt(args[1])))
	} catch (e) {
		// do nothing because slash is optional
	}	
}