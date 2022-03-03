var GameState = function(game){};

var gameState = null;

var particles = null;
var textParticles = null;

GameState.prototype = {

    preload: function () {
        game.input.onDown.add(function () {
            if (game.paused){
                game.paused = false;
            }
        });
    },

    create: function ()
    {
        //game.add.plugin(Phaser.Plugin.Debug);

        game.stage.backgroundColor = 0xFFFFFF;
        game.renderer.renderSession.roundPixels = true;
        //this.game.plugins.add(Phaser.Plugin.Debug);

        if(!Phaser.Device.desktop){
            ScenesTransitions.TRANSITION_LENGTH *= 0.4;
            game.time.advancedTiming = true;
            game.time.desiredFps = 30;
        }

        //game.time.slowMotion = 5;
        gameState = this;

        soundManager = new SoundManager(game);
        soundManager.create();

        GameData.Load();

        scenes = [];

        scenes.push(new SceneMenu());
        scenes.push(new SceneLevelSelection());
        scenes.push(new SceneGame());
        scenes.push(new SceneGems());
        scenes.push(new SceneTopUI());
        scenes.push(new SceneOverlay());
        scenes.push(new SceneLevelDescription());
        scenes.push(new SceneInstructions());
        scenes.push(new SceneLanguages());
        scenes.push(new ScenePause());
        scenes.push(new SceneGameFailed());
        scenes.push(new SceneGameCleared());

        if(particles != null)
            particles.Destroy();
        particles = new Particles(grpSceneGame);

        if(textParticles != null)
            textParticles.Destroy();
        textParticles = new TextParticles(grpSceneGame);

        grpPrevLangScene = grpSceneGame;
        SceneMenu.instance.ShowAnimated(100);

        game.onPause.add(this.onGamePause, this);
        game.onResume.add(this.onGameResume, this);

        this.controlKeyESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.controlKeyESC.onDown.add(this.OnEscPressed, this);
        this.controlKeyF4 = game.input.keyboard.addKey(Phaser.Keyboard.F4);
        this.controlKeyF4.onDown.add(this.OnF4Pressed, this);
        this.controlKeyNumSub = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_SUBTRACT);
        this.controlKeyNumSub.onDown.add(this.OnNumSubPressed, this);
        this.controlKeyNumAdd = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ADD);
        this.controlKeyNumAdd.onDown.add(this.OnNumAddPressed, this);

        resizeCounter = 0;

        //PPS_USE-DEMO_VERSION
        /*
        demoTxtHore = game.add.text(game.width/2, 5, "DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO", {font: '25px gameFont', fill: '#B3B3B3', align: 'center', stroke: '#ffffff', strokeThickness: 4});
        demoTxtHore.anchor.x = 0.5;

        demoTxtDole = game.add.text(game.width/2, game.height + 5, "DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO", {font: '25px gameFont', fill: '#B3B3B3', align: 'center', stroke: '#ffffff', strokeThickness: 4});
        demoTxtDole.anchor.x = 0.5;
        demoTxtDole.anchor.y = 1;
        //PPS_USE-DEMO_VERSION
        */

        //------------------------------------------------

        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("test_ready"); // notify arena that game started
        //PPS_USE-ARKADIUM
        */
    },

    OnEscPressed: function()
    {
        scenes.forEach(function(scene) {
            if(typeof scene.OnEscPressed === 'function')
                scene.OnEscPressed();
        });

    },

    OnF4Pressed: function()
    {
        PlayerMin = 2;
        PlayerMax = 2;
        GameData.Save();

        SceneGame.instance.UpdateMinMaxHolders();
    },

    OnNumSubPressed: function()
    {
    },

    OnNumAddPressed: function()
    {
    },

    update: function ()
    {
        /*
        resizeCounter ++;
        if(resizeCounter % 20 == 0)
            onGameResize();
        */

        scenes.forEach(function(scene) {
            if(typeof scene.update === 'function')
                scene.update();
        });
    },

    updateTexts: function()
    {
        scenes.forEach(function(scene) {
            if(typeof scene.updateTexts === 'function')
                scene.updateTexts();
        });
    },

    onResolutionChange: function()
    {
        scenes.forEach(function(scene) {
            if(typeof scene.onResolutionChange === 'function')
                scene.onResolutionChange();
        });

        //PPS_USE-DEMO_VERSION
        /*
        try {
            demoTxtHore.x = demoTxtDole.x = game.width/2;
            demoTxtDole.y = game.height + 5;
        } catch (e){}
        //PPS_USE-DEMO_VERSION
        */
    },

    onGamePause: function ()
    {
        if(game.device.desktop && game.device.chrome) {
            game.input.mspointer.stop();
        }

        LOG('onGamePause');

        scenes.forEach(function(scene) {
            if(typeof scene.onPause === 'function')
                scene.onPause();
        });

        paused = true;
    },

    onGameResume: function ()
    {
        if(game.device.desktop && game.device.chrome) {
            game.input.mspointer.stop();
        }

        LOG('onGameResume');

        paused = false;

        scenes.forEach(function(scene) {
            if(typeof scene.onResume === 'function')
                scene.onResume();
        });

    },

    render: function ()
    {
        if (typeof renderFunction === "function") {
            renderFunction();
        }
    }
}

