'use strict';

module.exports = function AutoCamera(mod) {
    const fs = require('fs');
    const path = require('path');

    const config = require('./config.json');

	// config
	let data = config,
		enable = data.enable,
		setDistance = 0;
	
	let playerName = '';

	// command
	mod.command.add('cam', {
		// toggle
		'$none': () => {
			enable = !enable;
			send(`${enable ? 'En' : 'Dis'}abled`);
		},
		'$default': (num) => {
			if (!isNaN(num)) {
				setCamera(num);
				send(`Distance set at : ${num}`);
			}
			else send(`Invalid argument. usage : cam (num)`);
		},
		// set default
		'add': (num) => {
			if (!isNaN(num)) {
				let found = false;
				for (let i = 0, n = data.characterDefault.length; i < n; i++) {
					if (data.characterDefault[i].name === playerName) {
						found = true;
						data.characterDefault[i].distance = num;
						break;
					}
				}
				if (!found) {
					let temp = {
						name: playerName,
						distance: num
					};
					data.characterDefault.push(temp);
				}
				setDistance = num;
				saveJsonData();
				send(`Default distance set for "${playerName}" set at ${num}`);
			}
			else send(`Invalid argument. usage : cam [add (num)|rm]`);
		},
		'rm': () => {
			for (let i = 0, n = data.characterDefault.length; i < n; i++) {
				if (data.characterDefault[i].name === playerName) {
					data.characterDefault.splice(i, 1);
					saveJsonData();
					send(`Removed character-specific distance setting for "${playerName}"`);
					break;
				}
			}
		},
		'set': (num) => {
			if (!isNaN(num)) {
				data.defaultDistance = num;
				setDistance = num;
				saveJsonData();
				send(`Default distance set at ${num}`);
			}
			else send(`Invalid argument. usage : cam set (num)`)
		}
	});

	// mod.game
	mod.game.on('enter_game', () => {
		playerName = mod.game.me.name;
		setDistance = data.defaultDistance;
		for (let i = 0, n = data.characterDefault.length; i < n; i++) {
			if (data.characterDefault[i].name === playerName) {
				setDistance = data.characterDefault[i].distance;
				break;
			}
		}
	})

	// code
	mod.hook('S_SPAWN_ME', 'raw', () => {
		if (enable) setTimeout(() => { setCamera(setDistance); }, 1000)
	});

	// helper
	function setCamera(distance) {
		setDistance = distance;
		mod.send('S_DUNGEON_CAMERA_SET', 1, {
			enabled: true,
			default: setDistance,
			max: distance
		});
	}

	function saveJsonData() {
		fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(data));
	}

	function send(msg) { mod.command.message(`: ` + msg); }

}