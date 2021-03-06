define(['game/keyDown', 'game/states/skeletons/portal', 'util/functional', 'util/vectorMath'],
function (keyDown, portal, F, VM) {return {
	spawnPlatform: function (x, y) {
        let plat = this.groups.solids.create(x, y, 'atlas', 'platform-1');
		plat.update = function(){
			plat.x -= 2;
		}
        plat.scale.setTo(2);
        plat.body.immovable = true;
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        return plat;
    },
    spawnProjectile: function (x, y) {
        let projectile = this.groups.hazards.create(x, y, 'atlas', 'asteroid');
        projectile.scale.setTo(2);
		projectile.body.setCircle(5, 6, 6);
        projectile.body.immovable = true;
		projectile.body.velocity.x = -175 - Math.random()*150;
        projectile.body.velocity.y = (-1*projectile.body.velocity.x) - Math.random()*120;
        return projectile;
    },
    create: function () {
        this.portal = undefined;
		// Positioning the player at the start of the level
        this.player.x = this.game.width/4;
        this.player.y = this.game.height-150;
		this.player.body.collideWorldBounds=true;

		// Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Background Color
		this.game.stage.backgroundColor = "#facade";

		// Play audio
        //this.game.audiosprite.play('spacelava');

		// Create 'solids' group
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;

		// Create 'hazards' group
		this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;
				
		// Create ground
		this.ground = this.game.add.tileSprite(0,this.game.height-100, this.game.width, 100, 'atlas', 'moon');
		this.groups.solids.add(this.ground);
		this.ground.body.immovable = true;
		
		this.world.bringToTop(this.groups.hazards);
		this.world.bringToTop(this.ground);

		// Setting a timer that will randomly generate platforms
		// starting from the top of the screen using 'spawnPlatform'
		this.projTimer = this.game.time.create(false);
		this.projTimer.loop(500, function () {
		    this.spawnProjectile(this.game.width+10,(Math.random()*(this.game.height+100))-250);
		}, this);
		this.projTimer.start();
        this.portalTimeout = 1000;
		
		// Setting a timer that will randomly generate platforms
		// starting from the top of the screen using 'spawnPlatform'
		this.platTimer = this.game.time.create(false);
		this.platTimer.loop(775, function () {
		    this.spawnPlatform(this.game.width,(this.game.height-200)-(Math.floor(Math.random()*3)*100));
		}, this);
		this.platTimer.start();
    },
    update: function () {
		let speed = 2;
		this.ground.tilePosition.x -= speed;
		if(!keyDown('left') && !keyDown('right'))this.player.x -= speed;

        this.portalTimeout--;
        if (this.portalTimeout <= 0 && !this.portal) {
            this.addSkel(portal);
            this.portal.x = this.game.width+10;
            this.portal.y = this.game.height-150;
            console.log(this.portal.x, this.portal.y);
            this.portal.body.velocity.x = -12;
        }
    },
};});
