Particles = function(grp)
{
    this.MAX_PARTICLES = 100;

    if(!Phaser.Device.desktop)
        this.MAX_PARTICLES = 50;

    this.objParticles = [];
    this._init();

    Particles.instance = this;
},

Particles.instance = null;

Particles.prototype =
{
    constructor: Particles,

    _init: function(grp)
    {
        this.grpParticles = game.add.group();

        var data = {
            tag: '',
            velX: 0,
            velY: 0,
            accX: 0,
            accY: 0,
            sprite: 'pak1',
            frameName: 'particle_smallest.png'
        };

        for(var i = 0; i < this.MAX_PARTICLES; i++)
            this.CreateParticle(0, 0, data);
        for(var i = 0; i < this.MAX_PARTICLES; i++)
            this.objParticles[i].sprite.visible = false;
    },

    //velX, velY, accX, accY, sprite, frame, blendMode)

    CreateParticle: function( x, y, data)
    {
        if (!data.hasOwnProperty('tag'))
            data.tag = '';
        if (!data.hasOwnProperty('frame'))
            data.frame = 0;
        if (!data.hasOwnProperty('blendMode'))
            data.blendMode = PIXI.blendModes.NORMAL;
        if (!data.hasOwnProperty('life'))
            data.life = 500 + getRandomUInt(200);
        if (!data.hasOwnProperty('velX'))
            data.velX = 0;
        if (!data.hasOwnProperty('velY'))
            data.velY = 0;
        if (!data.hasOwnProperty('accX'))
            data.accX = 0;
        if (!data.hasOwnProperty('accY'))
            data.accY = 0;
        if (!data.hasOwnProperty('rotation'))
            data.rotation = 0;
        if (!data.hasOwnProperty('scale'))
            data.scale = {start:1, end:1};
        else{
            if (!data.scale.hasOwnProperty('start'))
                data.scale.start = 1;
            if (!data.scale.hasOwnProperty('end'))
                data.scale.end = data.scale.start;
        }
        data.scale.delta = data.scale.start - data.scale.end;

        if (!data.hasOwnProperty('alpha'))
            data.alpha = {start:1, end:1};
        else{
            if (!data.alpha.hasOwnProperty('start'))
                data.alpha.start = 1;
            if (!data.alpha.hasOwnProperty('end'))
                data.alpha.end = data.alpha.start;
        }
        data.alpha.delta = data.alpha.start - data.alpha.end;

        var part = null;

        for (var i = 0; (i < this.objParticles.length) && (part == null); i++)
            if(!this.objParticles[i].sprite.visible){
                part = this.objParticles[i];
                if(part.sprite.key != data.sprite)
                    part.sprite.loadTexture(data.sprite);
                part.sprite.frame = data.frame;
                if (data.hasOwnProperty('frameName'))
                    part.sprite.frameName = data.frameName;
            }
        if(part === null){
            if(this.objParticles.length == this.MAX_PARTICLES)
                return null;

            part = this.objParticles[this.objParticles.length] = new Object();
            part.sprite = this.grpParticles.create(-100, -100, data.sprite, data.frame);
            part.sprite.anchor.set(0.5);
            if (data.hasOwnProperty('frameName'))
                part.sprite.frameName = data.frameName;
        }

        game.world.bringToTop(part.sprite);
        part.sprite.visible = true;
        part.sprite.alpha = data.alpha.start;
        part.sprite.angle = 0;
        part.sprite.x = x;
        part.sprite.y = y;
        part.sprite.scale.set(1);
        part.sprite.tint = 0xFFFFFF;
        part.sprite.blendMode = data.blendMode;
        part.data = data;
        part.data.accX = part.data.accX * getCpuSpeedMul();
        part.data.accY = part.data.accY * getCpuSpeedMul();
        part.data.velX = part.data.velX * getCpuSpeedMul();
        part.data.velY = part.data.velY * getCpuSpeedMul();
        part.data.life = part.data.life / getCpuSpeedMul();
        part.data.lifeInit = data.life;

        //if(data.tag.length > 0)
        //    LOG('TILES : ' + Particles.instance.GetActiveCount(data.tag));


        return(part);
    },

    Reset: function()
    {
        for (var i = 0; i < objParticles.length; i++)
            this.objParticles[i].sprite.visible = false;
    },

    GetActiveCount: function(tag)
    {
        tag = tag || null;

        var retVal = 0;
        for (var i = 0; i < this.objParticles.length; i++) {
            if(tag != null){
                if (this.objParticles[i].data.tag != tag)
                    continue;
            }
            if (!this.objParticles[i].sprite.visible)
                continue;

            if (objParticles[i].data.life > 0)
                retVal++;
        }

        return retVal;
    },

    Update: function()
    {
        for (var i = 0; i < this.objParticles.length; i++){
            if(!this.objParticles[i].sprite.visible)
                continue;

            this.objParticles[i].data.life -= game.time.elapsedMS;

            if (this.objParticles[i].data.life <= 0) {
                this.objParticles[i].sprite.visible = false;
                continue;
            }

            this.objParticles[i].sprite.alpha = this.objParticles[i].data.alpha.start - this.objParticles[i].data.alpha.delta + (this.objParticles[i].data.life / this.objParticles[i].data.lifeInit) * this.objParticles[i].data.alpha.delta;
            this.objParticles[i].sprite.scale.set(this.objParticles[i].data.scale.start - this.objParticles[i].data.scale.delta + (this.objParticles[i].data.life / this.objParticles[i].data.lifeInit) * this.objParticles[i].data.scale.delta);
            this.objParticles[i].sprite.angle += this.objParticles[i].data.rotation;
            this.objParticles[i].sprite.x += this.objParticles[i].data.velX;
            this.objParticles[i].sprite.y += this.objParticles[i].data.velY;
            this.objParticles[i].data.velX += this.objParticles[i].data.accX;
            this.objParticles[i].data.velY += this.objParticles[i].data.accY;
        }

    },

    Destroy: function() {
        for (var i = 0; i < this.objParticles.length; i++) {
            this.objParticles[i].sprite.destroy();
            this.objParticles[i].sprite = null;
            this.objParticles[i] = null;
        }
        this.objParticles = null;
    },

    CreateBubbles: function(xpos, ypos, colour, particlesCount, life, blendMode)
    {
        particlesCount = particlesCount || 10;
        blendMode = blendMode ||  PIXI.blendModes.NORMAL;

        for (var i = particlesCount - 1; i >= 0; i--) {
            tmpX = game.rnd.integerInRange(-100, 100) / 30;
            tmpY = game.rnd.integerInRange(50, 100) / 1000;
            //x, y, velX, velY, accX, accY, sprite)

            var scl = (5 + getRandomUInt(5)) / 10;
            var alph = (2 + getRandomUInt(5)) / 10;

            var data = {
                            velX: 0,
                            velY: -tmpY,
                            accX: 0,
                            accY:(tmpY <= 0) ? 0.01 : -0.01,
                            sprite: 'pak1',
                            frameName: 'particle_smallest.png',
                            blendMode: blendMode,
                            rotation: (tmpX <= 0) ? 4 : 4,
                            scale: {start: scl, end: scl},
                            alpha: {start: alph, end: alph},
                            life: life
                        };

            var part = this.CreateParticle( xpos + game.rnd.integerInRange(-6, 6), ypos + game.rnd.integerInRange(-4, 4), data);
                                           //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');

            if(part == null)
                continue;

            part.sprite.tint = colour;
        }
    },

    CreateTrail: function(xpos, ypos, colour)
    {
        particlesCount = 1;
        blendMode = PIXI.blendModes.ADD;
        life = 700;

        if(!Phaser.Device.desktop)
            life = Math.ceil(life * 0.6);

        for (var i = particlesCount - 1; i >= 0; i--) {
            //x, y, velX, velY, accX, accY, sprite)
            var scl = (5 + getRandomUInt(5)) / 10;
            var alph = (2 + getRandomUInt(5)) / 10;

            var data = {
                velX: 0,
                velY: 0,
                accX: 0,
                accY: 0,
                sprite: 'pak1',
                frameName: 'dot_1.png',
                blendMode: blendMode,
                rotation: 0,
                scale: {start: 1, end: 0.3},
                alpha: {start: 0.6, end: 0},
                life: life
            };

            var part = this.CreateParticle( xpos, ypos, data);
            //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');
            if(part == null)
                continue;

            part.sprite.tint = colour;
        }
    },

    CreateStars: function(xpos, ypos, colour, particlesCount, blendMode)
    {
        particlesCount = particlesCount || 10;
        blendMode = blendMode ||  PIXI.blendModes.NORMAL;

        for (var i = particlesCount - 1; i >= 0; i--) {
            tmpX = game.rnd.integerInRange(-100, 100) / 20;
            tmpY = game.rnd.integerInRange(-100, 100) / 20;
            //x, y, velX, velY, accX, accY, sprite)

            var data = {
                velX: tmpX,
                velY: tmpY,
                accX:(tmpX <= 0) ? 0.01 : -0.01,
                accY:(tmpY <= 0) ? 0.01 : -0.01,
                sprite: 'pak1',
                frameName: 'star_particles.png',
                blendMode: blendMode,
                rotation: (tmpX <= 0) ? 4 : 4,
                scale: {start: 0.7, end: 2},
                alpha: {start: 0.7, end: 0},
                life: 700
            };

            var part = this.CreateParticle( xpos + game.rnd.integerInRange(-4, 4), ypos + game.rnd.integerInRange(-4, 4), data);
            //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');

            if(part == null)
                continue;

            part.sprite.tint = colour;
        }
    },

    CreateFinalStars: function(xpos, ypos, colour, particlesCount, blendMode)
    {
        particlesCount = particlesCount || 10;
        blendMode = PIXI.blendModes.NORMAL;

        for (var i = particlesCount - 1; i >= 0; i--) {
            tmpX = game.rnd.integerInRange(-100, 100) / 25;
            tmpY = game.rnd.integerInRange(-100, 100) / 25;
            //x, y, velX, velY, accX, accY, sprite)

            var tmpScale = (getRandomUInt(20) / 100);

            var data = {
                velX: tmpX,
                velY: tmpY,
                accX:(tmpX <= 0) ? 0.02 : -0.02,
                accY:(tmpY <= 0) ? 0.02 : -0.02,
                sprite: 'pak1',
                frameName: 'star_particles.png',
                blendMode: blendMode,
                rotation: (tmpX <= 0) ? 4 : 4,
                scale: {start: 0.8 - tmpScale, end: 1.8 - tmpScale},
                alpha: {start: 1, end: 0.0},
                life: 700
            };

            var part = this.CreateParticle( xpos + game.rnd.integerInRange(-10, 10), ypos + game.rnd.integerInRange(-10, 10), data);
            //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');

            if(part == null)
                continue;

            part.sprite.tint = colour;
        }
    },

    CreateFallingStars: function( xpos, ypos, frameName)
    {
        particlesCount = 6;

        for (var i = particlesCount - 1; i >= 0; i--) {
            var tmpX = game.rnd.integerInRange(-100, 100) / 50;
            var tmpY = game.rnd.integerInRange(-100, 100) / 50;

            var data = {
                velX: tmpX,
                velY: tmpY,
                accX: (tmpX <= 0) ? 0.01 : -0.01,
                accY: (tmpY <= 0) ? 0.01 : -0.01,
                sprite: 'pak1',
                frameName: frameName,
                blendMode: PIXI.blendModes.NORMAL,
                rotation: 0,
                scale: {start: 1, end: 0.3},
                alpha: {start: 0.7, end: 0},
                life: 500
            };

            var part = this.CreateParticle( xpos, ypos, data);
            //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');
            if(part == null)
                continue;
        }
    },

    CreateDiskExplosion: function( xpos, ypos, colors, particlesCount)
    {
        if(colors.length == 0)
            return;

        particlesCount = particlesCount || 40;

        for (var i = particlesCount - 1; i >= 0; i--) {
            var tmpX = game.rnd.integerInRange(-100, 100) / 90;
            var tmpY = game.rnd.integerInRange(-100, 100) / 90;
            var tmpScl = getRandomUInt(7) / 5;

            var data = {
                velX: tmpX,
                velY: tmpY,
                accX: ((tmpX <= 0) ? 0.01 : -0.01) / 3,
                accY: ((tmpY <= 0) ? 0.01 : -0.01) / 3,
                sprite: 'pak1',
                frameName: 'blank.png',
                blendMode: PIXI.blendModes.NORMAL,
                rotation: 0,
                scale: {start: 1.5 + tmpScl, end: 0.3 + tmpScl},
                alpha: {start: 0.9, end: 0.1},
                life: 500
            };

            var part = this.CreateParticle( xpos + getRandomInt(60), ypos + getRandomInt(60), data);
            //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');
            if(part == null)
                continue;
            part.sprite.tint = colors[getRandomUInt(colors.length)];
        }
    }

}


