var menu = {
    
    
    preload: function() {
        console.log("menu preload");
        game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        game.physics.startSystem(Phaser.Physics.ARCADE);

    },
    
    create: function() {
        console.log("menu create");
        
        // key handler
        // give us all the keys we may need
        keys = game.input.keyboard.addKeys({    'up': Phaser.KeyCode.UP,
											    'down': Phaser.KeyCode.DOWN,
											    'right': Phaser.KeyCode.RIGHT,
											    'left': Phaser.KeyCode.LEFT,
											    'space': Phaser.KeyCode.SPACEBAR,
                                                'z': Phaser.KeyCode.Z,
                                                'x': Phaser.KeyCode.X});
        
    
        drawTitle();
        drawCatcher();
    },
    
    update: function() {
        
        if (keys.space.isDown) {
            console.log("space");
			this.game.state.start("play");
		}
        
		//drawTitle();
        //drawCatcher();
		//endFrame();
    }
};