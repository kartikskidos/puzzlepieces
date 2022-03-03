var SceneLevelSelection = function()
{
    SceneLevelSelection.instance = this;

    this.create();
};

SceneLevelSelection.instance = null;

SceneLevelSelection.prototype = {

    create: function ()
    {
        grpSceneLevelSelection = game.add.group();

        grpSceneLevelSelection = game.add.group();
        grpSceneLevelSelection.name = 'grpSceneLevelSelection';

        grpSceneLevelSelectionLevels = game.add.group();
        grpSceneLevelSelection.add(grpSceneLevelSelectionLevels);

        grpSceneLevelSelectionLevels.x = game.width >> 1;
        grpSceneLevelSelectionLevels.y = game.height >> 1;

        this.createLevelButtons();
        this.createLevelPageOffsets();

        grpSceneLevelSelectionLevels.sceneName = "grpSceneLevelSelectionLevels";

        grpSceneLevelSelection.visible = false;
        grpSceneLevelSelection.sceneName = "grpSceneLevelSelection";

        selectedLevelOffset = 0;
        levelsPage = 0;

        btnLevelsBackToMenu = grpSceneLevelSelection.create(50, game.height - 50, 'pak1', 'back.png');
        btnLevelsBackToMenu.anchor.set(0.5);
        //btnLevelsBackToMenu.scale.set(0.5);
        AddButtonEvents(btnLevelsBackToMenu, this.OnPressedLevelSelectionBackToMenu, ButtonOnInputOver, ButtonOnInputOut);

        this.onResolutionChange();
    },

    createLevelButtons: function()
    {
        var itemW = 82;
        var itemH = 110;
        var gap = 4;
        var itemW2 = Math.round(itemW / 2);
        var itemH2 = Math.round(itemH / 2);
        var left  = Math.round(( - (4 * itemW + 3 * gap)) / 2) + itemW2;
        var right = Math.round(( + (4 * itemW - 3 * gap)) / 2) - itemW2;
        var top = Math.round(( - (5 * itemH + 4 * gap)) / 2) + itemH2;

        btnLevels = [];
        imgLevelsLinesH = [];
        imgLevelsLinesV = [];

        for(var y = 0; y < 5; y ++)
        {
            var posy = top + y * (itemH + gap);

            imgLevelsLinesH[y] = grpSceneLevelSelectionLevels.create(0, posy, 'pak1', 'blank.png');
            imgLevelsLinesH[y].anchor.set(0.5);
            imgLevelsLinesH[y].tint = 0xb3b3b3;
            imgLevelsLinesH[y].width = (4 * itemW + 3 * gap) - itemW;

            if(y < 4){
                imgLevelsLinesV[y] = grpSceneLevelSelectionLevels.create(0, posy, 'pak1', 'blank.png');
                imgLevelsLinesV[y].anchor.setTo(0.5, 0);
                imgLevelsLinesV[y].tint = 0xb3b3b3;
                imgLevelsLinesV[y].height = itemH;
            }

            for (var x = 0; x < 4; x++)
            {
                var idx = y * 4 + x;
                var posx = left + x * (itemW + gap) + itemW2;

                if (y % 2 != 0)
                    posx = right - x * (itemW + gap);

                btnLevels[idx] = grpSceneLevelSelectionLevels.create(posx, posy, 'pak1', 'level_bg.png');

                btnLevels[idx].inputEnabled = true;
                //btnLevels[idx].events.onInputOver.add(this.LevelButtonOnInputOver, {button:btnLevels[idx]});
                //btnLevels[idx].events.onInputOut.add(this.LevelButtonOnInputOut, {button:btnLevels[idx]});
                btnLevels[idx].events.onInputDown.add(this.OnPressedLevel, {level: idx});
                btnLevels[idx].anchor.set(0.5);

                var txtlevelNum = new Phaser.Text(game, 0, 2, "0", {font: '25px gameFont', fill: '#ffffff'});
                txtlevelNum.anchor.x = getCorrectAnchorX(txtlevelNum, 0.5);
                txtlevelNum.anchor.y = getCorrectAnchorY(txtlevelNum, 0.5);
                //txtlevelNum.shadowOffsetX = 3;
                //txtlevelNum.shadowOffsetY = 5;
                //txtlevelNum.shadowColor = '#660000';
                //txtlevelNum.shadowFill = '#660000';
                btnLevels[idx].addChild(txtlevelNum);
                btnLevels[idx].txtLevelNum = txtlevelNum;

                var imgLock = grpSceneLevelSelectionLevels.create(0, 0, 'pak1', 'lock.png');
                imgLock.anchor.set(0.5);
                btnLevels[idx].imgLock = imgLock;
                btnLevels[idx].addChild(imgLock);
            }
        }
    },

    createLevelPageOffsets: function()
    {
        imgLevelSelectionLevelOffsetsAnchor = grpSceneLevelSelection.create(100, 100, 'pak1', 'void.png');

        var dspy = 50;
        var posy = 0 - 1 * dspy;

        imgLevelOffset = [];
        for(var i = 0; i < 3; i++){
            imgLevelOffset[i] = grpSceneLevelSelection.create(0, posy, 'pak1', 'site_on.png');
            imgLevelOffset[i].anchor.set(0.5)
            imgLevelOffset[i].scale.set(1);
            imgLevelOffset[i].page = i;
            imgLevelSelectionLevelOffsetsAnchor.addChild(imgLevelOffset[i]);
            AddButtonEvents(imgLevelOffset[i], this.OnPressedLevelPage, ButtonOnInputOver, ButtonOnInputOut);
            posy += dspy;
        }
    },

    onResolutionChange: function()
    {
        imgLevelSelectionLevelOffsetsAnchor.y = grpSceneLevelSelectionLevels.y;
        imgLevelSelectionLevelOffsetsAnchor.x = game.width - 40;

        btnLevelsBackToMenu.reset(TOP_ICONS_BORDER, game.height - TOP_ICONS_BORDER);

        grpSceneLevelSelectionLevels.x = game.width >> 1;
        grpSceneLevelSelectionLevels.y = game.height * 0.45 + 30;
    },

    OnPressedLevel: function()
    {
        LOG("OnPressedLevel()");

        soundManager.playSound('button');

        selectedLevel = this.button.level;

        if(!Levels.hasOwnProperty(selectedLevel)) {
            console.error('LevelsData error! Undefined level : ' + selectedLevel);
            return;
        }

        if(!GameData.BuildDebug)
            if(SceneLevelSelection.instance.levelIsLocked(selectedLevel)){
                //this.button.frame = (this.lock) ? 3 : 1;
                return;
            }

        if(selectedLevel > 100){
            previousLevel = this.button.prevLevel;
        }

        SceneLevelDescription.instance.ShowAnimated();
        SceneOverlay.instance.ShowAnimated();

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */

        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("event_change"); // refresh display ads
        //PPS_USE-ARKADIUM
        */
    },

    OnPressedLevelPage: function()
    {
        SceneLevelSelection.instance.SwitchPage(this.button.page);
    },

    updateLevelOffsets: function()
    {
        for(var i = 0; i < imgLevelOffset.length; i++)
            imgLevelOffset[i].frameName = (levelsPage == i) ? 'site_on.png' : 'site_off.png';
    },

    updateLevelsButtons: function()
    {
        LOG("updateLevelsButtons()");

        //btnDecLevelOffset.inputEnabled = (levelsPage == 1);
        //btnIncLevelOffset.inputEnabled = (levelsPage == 0);

        //btnDecLevelOffset.visible = (levelsPage == 1);
        //btnIncLevelOffset.visible = (levelsPage == 0);

        var itemW = 82;
        var gap = 4;
        var itemW2 = Math.round(itemW / 2);
        var left  = Math.round(( - (4 * itemW + 3 * gap)) / 2) + itemW2;
        var right = Math.round(( + (4 * itemW + 3 * gap)) / 2) - itemW2;

        for(var y = 0; y < 5; y ++)
        {
            for (var x = 0; x < 4; x++)
            {
                var idx = y * 4 + x;

                if ((levelsPage % 2) == 0)
                {
                    if ((y % 2) == 0)
                    {
                        posxV = right;
                        posx = left + x * (itemW + gap);
                    }else{
                        posxV = left;
                        posx = right - x * (itemW + gap);
                    }
                } else
                {
                    if ((y % 2) == 0)
                    {
                        posxV = left;
                        posx = right - x * (itemW + gap);
                    }else{
                        posxV = right;
                        posx = left + x * (itemW + gap);
                    }
                }

                if((x == 0) && (y < 4))
                    imgLevelsLinesV[y].x = posxV;

                btnLevels[idx].x = posx;
            }
        }


        var level = 0;
        for(var idx = 0; idx < btnLevels.length; idx ++){
            var totalLevel = (levelsPage * 15) + level;
            var txtlevelNum = btnLevels[idx].txtLevelNum;
            var levelLocked = this.levelIsLocked(totalLevel);

            btnLevels[idx].frameName = 'level_bg.png';
            if(SceneLevelSelection.instance.levelWasPlayed(totalLevel))
                btnLevels[idx].frameName = 'level_bg2.png';

            txtlevelNum.text = "" + (totalLevel + 1);
            txtlevelNum.visible = !levelLocked;

            btnLevels[idx].events.onInputDown.dispose();
            btnLevels[idx].events.onInputOver.dispose();
            btnLevels[idx].events.onInputOut.dispose();

            btnLevels[idx].events.onInputDown.add(this.OnPressedLevel, {level:totalLevel, button:btnLevels[idx], lock:levelLocked, context:this});
            //btnLevels[idx].events.onInputOver.add(this.LevelButtonOnInputOver, {button:btnLevels[idx], lock:levelLocked });
            //btnLevels[idx].events.onInputOut.add(this.LevelButtonOnInputOut, {button:btnLevels[idx], lock:levelLocked });
            btnLevels[idx].tint = 0xFFFFFF;

            btnLevels[idx].imgLock.visible = SceneLevelSelection.instance.levelIsLocked(totalLevel);
            if(btnLevels[idx].imgLock.visible)
                btnLevels[idx].frameName = 'level_bg3.png';

            if(idx % 4 < 3){
                btnLevels[idx].level = totalLevel;
                level ++;
            }
            else{
                btnLevels[idx].frameName = 'level_bg4.png';
                if(SceneLevelSelection.instance.levelWasPlayed(totalLevel))
                    btnLevels[idx].frameName = 'level_bg5.png';
                if(btnLevels[idx].imgLock.visible)
                    btnLevels[idx].frameName = 'level_bg5.png';

                txtlevelNum.text = "B";
                btnLevels[idx].prevLevel = totalLevel;
                btnLevels[idx].level = 100 + Math.floor(totalLevel / 3);
                LOG('totalLevel - > ' + btnLevels[idx].level);
            }

        }
    },

    levelIsLocked: function(idx)
    {
        var flag = 0;

        try{
            flag = LevelFlags[idx];
        }catch(e){
            flag = 0;
        }
        if(flag === undefined)
            flag = 0;

        return (flag == 0);
    },

    levelWasPlayed: function(idx)
    {
        return (LevelFlags[idx] == 10);
    },

    updateTexts: function()
    {
        /*
        if(selectedLevelDiff == ID_MODE_EASY)
            txtSelectedDifficulty.text = STR('EASY');
        if(selectedLevelDiff == ID_MODE_MEDIUM)
            txtSelectedDifficulty.text = STR('MEDIUM');
        if(selectedLevelDiff == ID_MODE_HARD)
            txtSelectedDifficulty.text = STR('HARD');
            */
    },

    OnPressedLevelSelectionBackToMenu: function()
    {
        soundManager.playSound('button');
        SceneLevelSelection.instance.HideAnimated();
        SceneMenu.instance.ShowAnimated();

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */

        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("event_change"); // refresh display ads
        //PPS_USE-ARKADIUM
        */
    },

    OnPressedLevelSelectionShop: function()
    {
        soundManager.playSound('button');
        SceneLevelSelection.instance.HideAnimated();
        SceneShop.instance.ShowAnimated();
    },

    SwitchPage: function(newPage)
    {
        ScenesTransitions.transitionStarted();

        var destY = game.height * 1.3;

        if(newPage > levelsPage)
            destY = - game.height * 1.3;

        var hideTween = game.add.tween(grpSceneLevelSelectionLevels);
        hideTween.to({y: destY, alpha: 0}, 500, Phaser.Easing.Linear.Out);
        hideTween.onComplete.add(function(){
            levelsPage = this.newPage;
            SceneLevelSelection.instance.updateLevelsButtons();
            SceneLevelSelection.instance.updateLevelOffsets();

            grpSceneLevelSelectionLevels.y *= -1;

            var showTween = game.add.tween(grpSceneLevelSelectionLevels);
            showTween.to({y: game.height * 0.45 + 30, alpha: 1}, 500, Phaser.Easing.Quartic.Out);
            showTween.onComplete.add(function(){
                ScenesTransitions.transitionFinished();
            }, {});
            showTween.start();

        }, {newPage: newPage});
        hideTween.start();

        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("event_change"); // refresh display ads
        //PPS_USE-ARKADIUM
        */
    },

    ShowAnimated: function (delay)
    {
        if(delay === undefined) delay = 0;

        SceneLevelSelection.instance.onResolutionChange();
        SceneLevelSelection.instance.updateTexts();
        SceneLevelSelection.instance.updateLevelsButtons();
        SceneLevelSelection.instance.updateLevelOffsets();

        ScenesTransitions.transitionStarted();
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;

        ScenesTransitions.showSceneAlpha(grpSceneLevelSelection, delay, 200);

        for(var idx = 0; idx < btnLevels.length; idx ++){
            var callback = (idx <24 ) ? null : ScenesTransitions.transitionFinished;
            ScenesTransitions.showSceneScale(btnLevels[idx], delay + idx * 20, 70, callback, Phaser.Easing.Back.Out, 1);
        }

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();
        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
        ScenesTransitions.hideSceneAlpha(grpSceneLevelSelection, 0, ScenesTransitions.TRANSITION_LENGTH / 2, ScenesTransitions.transitionFinished);

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    }
}