var boot =  {
      
	preload: function() {
            
          console.log("preloading");
	},
    
  	create: function() {
          
        console.log("create");
        this.game.state.start("menu");
	}
};