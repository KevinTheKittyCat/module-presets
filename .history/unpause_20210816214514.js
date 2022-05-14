Hooks.once('ready', () => {
    if (game.paused) {
        game.togglePause(false, true);
		console.log("unpaused")
    }
})
