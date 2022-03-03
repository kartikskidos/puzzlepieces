TextParticles = function(grp)
{
    this.MAX_PARTICLES = 3;
    this.objTextParticles = [];
    this._init();

    TextParticles.instance = this;
},

TextParticles.instance = null;

TextParticles.prototype =
{
    constructor: TextParticles,

    _init: function(grp)
    {
        this.grpTextParticles = game.add.group();

        var data = {
            tag: '',
            velX: 0,
            velY: 0,
            accX: 0,
            accY: 0
        };

        for(var i = 0; i < this.MAX_PARTICLES; i++)
            this.CreateTextParticle(0, 0, 'DUMMY', data);

        for(var i = 0; i < this.MAX_PARTICLES; i++)
            this.objTextParticles[i].sprite.visible = false;
    },

    //velX, velY, accX, accY, sprite, frame, blendMode)

    CreateTextParticle: function(x, y, text, data)
    {
        if (!data.hasOwnProperty('tag'))
            data.tag = '';
        if (!data.hasOwnProperty('style'))
            data.style = {};
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

        for (var i = 0; (i < this.objTextParticles.length) && (part == null); i++)
            if(!this.objTextParticles[i].sprite.visible){
                part = this.objTextParticles[i];
                part.sprite.text = text;
                part.sprite.setStyle(data.style);
            }
        if(part === null){
            part = this.objTextParticles[this.objTextParticles.length] = new Object();
            part.sprite = new Phaser.Text(game, -100, -100, text, data.style);
            this.grpTextParticles.add(part.sprite);
            part.sprite.anchor.set(0.5);
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

        if(data.tag.length > 0)
            LOG('TILES : ' + Particles.instance.GetActiveCount(data.tag));


        return(part);
    },

    Reset: function()
    {
        for (var i = 0; i < this.objTextParticles.length; i++)
            this.objTextParticles[i].sprite.visible = false;
    },

    GetActiveCount: function(tag)
    {
        tag = tag || null;

        var retVal = 0;
        for (var i = 0; i < this.objTextParticles.length; i++) {
            if(tag != null){
                if (this.objTextParticles[i].data.tag != tag)
                    continue;
            }
            if (!this.objTextParticles[i].sprite.visible)
                continue;

            if (this.objTextParticles[i].data.life > 0)
                retVal++;
        }

        return retVal;
    },

    Update: function()
    {
        for (var i = 0; i < this.objTextParticles.length; i++){
            if(!this.objTextParticles[i].sprite.visible)
                continue;

            this.objTextParticles[i].data.life -= game.time.elapsedMS;

            if (this.objTextParticles[i].data.life <= 0) {
                this.objTextParticles[i].sprite.visible = false;
                continue;
            }

            this.objTextParticles[i].sprite.alpha = this.objTextParticles[i].data.alpha.start - this.objTextParticles[i].data.alpha.delta + (this.objTextParticles[i].data.life / this.objTextParticles[i].data.lifeInit) * this.objTextParticles[i].data.alpha.delta;
            this.objTextParticles[i].sprite.scale.set(this.objTextParticles[i].data.scale.start - this.objTextParticles[i].data.scale.delta + (this.objTextParticles[i].data.life / this.objTextParticles[i].data.lifeInit) * this.objTextParticles[i].data.scale.delta);
            this.objTextParticles[i].sprite.angle += this.objTextParticles[i].data.rotation;
            this.objTextParticles[i].sprite.x += this.objTextParticles[i].data.velX;
            this.objTextParticles[i].sprite.y += this.objTextParticles[i].data.velY;
            this.objTextParticles[i].data.velX += this.objTextParticles[i].data.accX;
            this.objTextParticles[i].data.velY += this.objTextParticles[i].data.accY;
        }

    },

    Destroy: function()
    {
        for (var i = 0; i < this.objTextParticles.length; i++) {
            this.objTextParticles[i].sprite.Destroy();
            this.objTextParticles[i].sprite = null;
            this.objTextParticles[i] = null;
        }

        this.objTextParticles = null;
    },

    CreateTextParticle1: function(xpos, ypos, text, size, colour, blendMode)
    {
        blendMode = blendMode ||  PIXI.blendModes.NORMAL;

        //tmpY = game.rnd.integerInRange(-100, -50) / 50;
        tmpY = -0.7;
        //x, y, velX, velY, accX, accY, sprite)

        var data = {
            velX: 0,
            velY: tmpY,
            accX: 0,
            accY:(tmpY <= 0) ? 0.015 : -0.015,
            style:{font: size + 'px gameFont', fill: colour, stroke: '#FFFFFF', strokeThickness: 4},
            blendMode: blendMode,
            rotation: 0,
            scale: {start: 1.2, end: 1},
            alpha: {start: 0.9, end: 0},
            life: 1000
        };

        var part = this.CreateTextParticle( xpos, ypos, text, data);
        //'pak_game', 'particle_star_' + game.rnd.integerInRange(0, 1) + '.png');
    }


}