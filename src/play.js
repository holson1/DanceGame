var play = {
    
    preload: function() {
        console.log("play preload");
        
        game.load.image("orb", "assets/images/orb.png");
    },
    
    create: function() {
        console.log("play create");
        
        // create all the sprites
        
        // draw the outside circle
        drawOutsideCircle();

        // draw the tracks
        drawTrack(0, y - (rectHeight / 2), x, rectHeight, 3);
        drawTrack(x - (rectHeight / 2), 0, rectHeight, y, 0);
        drawTrack(x, y - (rectHeight / 2), x, rectHeight, 1);
        drawTrack(x - (rectHeight / 2), y, rectHeight, y, 2);
        
        rects.forEach(function(Rect) {
			
		    Rect.draw();
	    });
        drawCatcher();
        
        orb = game.add.sprite(100, 100, "orb");
        game.physics.arcade.enable(orb);
        
    },
    
    update: function() {
        
        // *** PLAYING ***

        orb.x += 5;
        
        // MUSIC AND SYNCHRONIZATION
        // play music
        if (musicPlaying == false) {
            
            console.log("playing music");
            startTime = new Date().getTime();
            lastReportedPlayheadPosition = 0;
            mySong = playSound("120BPM");
            musicPlaying = true;
        }

        // debug var
        prevSongTime = songTime;

        // wait for song to actually start before recording song time
        if (mySong.position > 0) {
            songTime = new Date().getTime() - startTime;
        }
        else {
            startTime = new Date().getTime();
        }
        
        // debug var
        pureSongTime = songTime;
        
        // easing algorithm to keep song time (relatively) in sync with reported audio playhead
        if (mySong.position != lastReportedPlayheadPosition) {
                    
            songTime = (songTime + mySong.position) / 2;
        }
        
        // don't allow significant jumps around
        if (songTime - prevSongTime > 25) {
            songTime -= (songTime - prevSongTime - 25);
        }
        
        // calculate average diff
        avgDiff = ((avgDiff * diffCounter) + (songTime - mySong.position)) / (diffCounter + 1);
        
        if (mySong.position > 0) {
            diffCounter++;
        }
        
        //debug();
        
        mainChartReader.read(songTime);

        

        // update each orb
        orbs.forEach(function(Orb) {

            Orb.update();
            // Orb.draw();
        });

        // filter out inactive orbs
        orbs = orbs.filter(function(Orb) {
            return Orb.active;
        });

        // checking game state once again
        health--;

        if (health < 0) {
            health = 0;
        }

        if (health == 0) {
            state = "results";
            death_animT = 50;
        }

        if (health > 1100) {
            health = 1100;
        }

        // drawScore();
        // drawHealth();

        // if (combo > 1) {
        // 	drawCombo(combo);
        // }
        
        endFrame();     
    }
};