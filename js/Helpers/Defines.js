var partnerName = 'zWebStorm';
window["partnerName"] = partnerName;

var ANIMATION_CUBIC_IO = Phaser.Easing.Cubic.InOut;

var tmp_sprites = [];

function getRandomUInt(num)
{
    return Math.floor(Math.random() * num);
}

function getRandomInt(num)
{
    return Math.floor(Math.random() * num) * ((getRandomUInt(100) > 50) ? -1 : 1);
}

function getRandomUIntInRange(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntInRange(min, max)
{
    return getRandomUIntInRange(min, max)  * (getRandomUInt(100) > 50) ? -1 : 1;
}

String.prototype.replaceAll = function(search, replacement)
{
    var target = this;
    return target.split(search).join(replacement);
};

function cloneObject(obj)
{
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

function isUpperCase(myString)
{
    return (myString == myString.toUpperCase());
};

function isLowerCase(myString)
{
    return (myString == myString.toLowerCase());
};

function arraysOfNumsIdentical(arr1, arr2)
{
    if(arr1.length != arr2.length)
        return false;

    for(var i = 0; i < arr1.length; i++){
        if(arr1[i] != arr2[i])
            return false;
    }

    return true;
};

function arrayExistsInArray(arr, arrToExist)
{
    for(var i = 0; i < arr.length; i++){
        if(arraysOfNumsIdentical(arr[i], arrToExist))
            return true;
    }

    return false;
};

function LOG(msg)
{
    //PPS_DELETE-BUILD
    console.log(msg);
    //PPS_DELETE-BUILD
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function shuffleArray(array)
{
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setCorrectAnchor(obj, anch)
{
    obj.anchor.setTo(getCorrectAnchorX(obj, anch), getCorrectAnchorY(obj, anch));
    obj.updateTransform();
    obj.worldPosition.x = Math.floor(obj.worldPosition.x);
    obj.worldPosition.y = Math.floor(obj.worldPosition.y);
}

function getCorrectAnchorX(obj, anchX)
{
    return Math.round(obj.width * anchX) / obj.width;
}

function getCorrectAnchorY(obj, anchY)
{
    return Math.round(obj.height * anchY) / obj.height;
}

function getAndroidVersion(ua)
{
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
};

function updateTextToHeight(textObj, fontSize, fontName, maxHeight)
{
    textObj.style.font = fontSize + 'px "' + fontName + '"';
    while(textObj.height > maxHeight){
        fontSize --;

        var style = textObj.style;
        style.font = fontSize + 'px gameFont';
        textObj.setStyle(style);
    }
};

function updateTextToWidth(textObj, fontSize, fontName, maxWidth)
{
    textObj.style.font = fontSize + 'px "' + fontName + '"';
    while(textObj.width > maxWidth){
        fontSize --;

        var style = textObj.style;
        style.font = fontSize + 'px "' + fontName + '"';
        textObj.setStyle(style);
    }
};

function CreateBoardSpr(posX, posY, width, height, pak, spr, anchorX, anchorY, scaledW, scaledH)
{
    if (anchorX === undefined) anchorX = 0;
    if (anchorY === undefined) anchorY = 0;
    if (scaledW === undefined) scaledW = width;
    if (scaledH === undefined) scaledH = height;

    if(!tmp_sprites.contains(pak))
        tmp_sprites[pak] = game.make.sprite(-10000, -10000, pak);

    _width = width;
    _height = height;

    var tileW;
    var tileH;

    tileW = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).width;
    tileH = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).height;

    width = Math.floor((width / tileW) + 0.5) * tileW;
    height = Math.floor((height / tileH) + 0.5) * tileH;

    var bmpData = game.make.bitmapData(width, height);
    bmpData.smoothed = false;

    //posX -= (_width - width) / 2;
    //posY += (_width - width) / 2;

    var tile1WC = (width / tileW) - 2;
    var tile1HC = (height / tileH) - 2;

    var posLeft = 0;
    var posRight = posLeft + width;
    var posTop = 0;

    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0), posLeft, posTop);
    for(var i = 0; i < tile1WC; i++)
        bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft + tileW * (i + 1) , posTop);
    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 2), posRight - tileW, posTop);

    for(var j = 0; j < tile1HC; j++){
        bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 3), posLeft, posTop + tileH * (j + 1));
        bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 5), posRight - tileW, posTop + tileH * (j + 1));
        for(var i = 0; i < tile1WC; i++)
            bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 4), posLeft + tileW * (i + 1) , posTop + tileH * (j + 1));
    }

    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 6), posLeft, posTop + height - tileH);
    for(var i = 0; i < tile1WC; i++)
        bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 7), posLeft + tileW * (i + 1) , posTop + height - tileH);
    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 8), posRight - tileW, posTop + height - tileH);

    var spr = makeSprite(0, 0, 'pak1', 'void.png');
    var tid = game.rnd.uuid();
    var texture = bmpData.generateTexture(tid, function(texture){
        LOG('bmpData.generateTexture');
        this.sprite.loadTexture(texture);
        this.sprite.scale.set(1);
        this.sprite.width = this.scaledW;
        this.sprite.height = this.scaledH;
        this.sprite.anchor.setTo(this.anchorX, this.anchorY);
    }, {sprite: spr, anchorX: anchorX, anchorY: anchorY, scaledW: scaledW, scaledH: scaledH});

    spr.x = posX;
    spr.y = posY;

    bmpData.destroy();
    bmpData = null;

    return spr;
};

function CreateDialogSpr(posX, posY, width, height, pak, spr, anchorX, anchorY, scaledW, scaledH)
{
    var tileW;
    var tileH;

    if (anchorX === undefined) anchorX = 0;
    if (anchorY === undefined) anchorY = 0;
    if (scaledW === undefined) scaledW = width;
    if (scaledH === undefined) scaledH = height;

    if(!tmp_sprites.contains(pak))
        tmp_sprites[pak] = game.make.sprite(-10000, -10000, pak);

    tileW = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).width;
    tileH = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).height;

    var bmpData = game.make.bitmapData(width, height);
    bmpData.smoothed = false;

    var posLeft = 0;
    var posRight = posLeft + width;
    var posTop = 0;

    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0), posLeft, posTop);
    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft, posTop + tileH, tileW, height - 2 * tileH);
    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 2), posLeft, posTop + height - tileH);

    var spr = makeSprite(0, 0, 'pak1', 'void.png');
    var tid = game.rnd.uuid();
    var texture = bmpData.generateTexture(tid, function(texture){
        LOG('bmpData.generateTexture');
        this.sprite.loadTexture(texture);
        this.sprite.width = this.scaledW;
        this.sprite.height = this.scaledH;
        this.sprite.anchor.setTo(this.anchorX, this.anchorY);
    }, {sprite: spr, anchorX: anchorX, anchorY: anchorY, scaledW: scaledW, scaledH: scaledH});

    spr.x = posX;
    spr.y = posY;
    //spr.width = scaledW;
    //pr.height = scaledH;

    bmpData.destroy();
    bmpData = null;

    return spr;
};


function CreateButtonSpr(posX, posY, width, pak, spr, anchorX, anchorY, scaleX, scaleY)
{
    if (anchorX === undefined) anchorX = 0;
    if (anchorY === undefined) anchorY = 0;
    if (scaleX === undefined) scaleX = 1;
    if (scaleY === undefined) scaleY = 1;

    if(!tmp_sprites.contains(pak))
        tmp_sprites[pak] = game.make.sprite(-10000, -10000, pak);

    _width = width;

    var tileW;
    var tileH;

    tileW = game.cache.getFrameByName(pak, spr + '_0.png').width;
    tileH = game.cache.getFrameByName(pak, spr + '_0.png').height;


    //width = Math.floor((width / tileW) + 0.5) * tileW;

    var bmpData = game.make.bitmapData(width, tileH);
    bmpData.smoothed = false;

    //posX -= (_width - width) / 2;
    //posY += (_width - width) / 2;

    var tile1WC = (width / tileW) - 2;

    var posLeft = 0;
    var posRight = posLeft + width;
    var posTop = 0;

    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0), posLeft, posTop);
    for(var i = 0; i < tile1WC; i++)
        bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft + tileW * (i + 1) , posTop);
    //bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft + tileW  , posTop, width - 2 * tileW);
    bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 2), posRight - tileW, posTop);

    var spr = makeSprite(0, 0, 'pak1', 'void.png');
    var tid = game.rnd.uuid();
    var texture = bmpData.generateTexture(tid, function(texture){
        this.sprite.loadTexture(texture);
        this.sprite.anchor.setTo(this.anchorX, this.anchorY);
        this.sprite.scale.setTo(this.scaleX, this.scaleY);
    }, {sprite: spr, anchorX: anchorX, anchorY: anchorY, scaleX: scaleX, scaleY: scaleY});
    spr.x = posX;
    spr.y = posY;
    spr.width = width * scaleX;
    spr.height = tileH * scaleY;

    bmpData.destroy();
    bmpData = null;

    return spr;
};


function getSpriteFrame(spr, frm)
{
    spr.frame = frm;
    return spr;
};

function getSpriteFrameWithinAtlas(pak, prefix, frm)
{
    pak.frameName = prefix + '_' + frm + '.png';
    return pak;
};


function makeSprite(x, y, spr, frm)
{
    frm = frm || 0;
    var spr = game.make.sprite(x, y, spr, frm);
    //killableGraphicsAssets.push(spr);
    return spr;
}

function addSprite(x, y, spr, frm)
{
    frm = frm || 0;
    var spr = game.add.sprite(x, y, spr, frm);
    //killableGraphicsAssets.push(spr);
    return spr;
}

function leadingZero(num, len)
{
    var retVal = '' + num;
    while(retVal.length < len)
        retVal = '0' + retVal;

    return retVal;
}

function SetPoingScaleTween(obj, duration, delay, easing)
{
    obj.scale.set(1);

    if(duration === undefined) duration = 150;
    if(delay === undefined) delay = 0;
    if(easing === undefined) easing = Phaser.Easing.Back.Out;

    var scl = 1.3;

    game.add.tween(obj.scale).to({x: scl, y: scl}, duration, easing, true, delay, 0, true);
}

/*
function SetPoingScaleTween(obj, duration, delay, callbackOnStart, easing)
{
    var negX = obj.scale.x < 0;
    var negY = obj.scale.y < 0;

    if(duration === undefined) duration = 150;
    if(delay === undefined) delay = 0;
    if(callbackOnStart === undefined) callbackOnStart = null;
    if(easing === undefined) easing = Phaser.Easing.Back.Out;

    var scale = obj.scale.x;

    var tween = game.add.tween(obj.scale).to({ x: scale * (negX ? -1 : 1) * 1.3, y:scale * (negY ? -1 : 1) * 1.3},duration, easing, true, delay, 0, true);

    tween.onStart.add(function(){
        if(this.callbackOnStart != null)
            this.callbackOnStart();
        this.obj.scale.setTo(scale * 1.3 * (negX ? -1 : 1), scale * 1.3 * (negY ? -1 : 1));
    }, {obj:obj, callbackOnStart: callbackOnStart})
}
*/

function CreateButtonWithText(group, parent, x, y, sprite, caption, spriteHighlighted, colorText, colorShadow, textSize)
{
    if(spriteHighlighted === undefined)
        spriteHighlighted = null;

    if(colorText === undefined)
        colorText = '#FFFFFF';

    if(colorShadow === undefined)
        colorShadow = '#000000';

    if(textSize === undefined)
        textSize = 25;

    var imgButtonBack = group.create(x, y, 'pak1', sprite);
    imgButtonBack.anchor.set(0.5);
    parent.addChild(imgButtonBack);

    if(spriteHighlighted != null){
        var imgButtonHighlighted = group.create(0, 0, 'pak1', spriteHighlighted);
        imgButtonHighlighted.anchor.set(0.5);
        imgButtonBack.addChild(imgButtonHighlighted);
        imgButtonBack.btnHighlighted = imgButtonHighlighted;
        imgButtonHighlighted.visible = false;
    }

    var txtButtonCaption = game.add.text(1, 0, caption, {font: textSize + 'px gameFont', fill: colorText});
    txtButtonCaption.anchor.setTo(0.5, 0.5);
    txtButtonCaption.shadowOffsetX = 2;
    txtButtonCaption.shadowOffsetY = 2;
    txtButtonCaption.shadowColor = colorShadow;
    txtButtonCaption.shadowFill = colorShadow;
    imgButtonBack.addChild(txtButtonCaption);
    imgButtonBack.txtCaption = txtButtonCaption;

    return imgButtonBack;
}

function SetTextColor(textObj, color, colorShadow)
{
    /*
    textObj.addColor(color, 0);
    textObj.shadowColor = colorShadow;
    textObj.shadowFill = colorShadow;
    */

    textObj.tint = color;
}

function wiggle(aProgress, aPeriod1, aPeriod2)
{
    var current1 = aProgress * Math.PI * 2 * aPeriod1;
    var current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2);

    return Math.sin(current1) * Math.cos(current2);
}

function MoveSpriteBezier(sprite, destX, destY, duration, callbackOnComplete, callbackOnCompleteParams)
{
    //if (callbackOnComplete === undefined) callbackOnComplete = null;

    var tween = null;

    tmpLine.start.x = sprite.world.x;
    tmpLine.start.y = sprite.world.y;
    tmpLine.end.x = destX;
    tmpLine.end.y = destY;

    var coords = tmpLine.coordinatesOnLine(Math.floor((tmpLine.length / 5) + 0.5));
    LOG('coords.lenght = ' + coords.length);
    if(coords.length < 5){
        coords[4] = [];
        coords[4][0] = coords[3][0];
        coords[4][1] = coords[3][1];
    }
    var p = coords[0];
    var sign = 1;//(getRandomUInt(1000) <= 500) ? 1 : -1;
    tmpLineNormal1.fromAngle(coords[1][0], coords[1][1], tmpLine.normalAngle, (Math.floor(tmpLine.length / 4) + getRandomInt(10)) * sign);
    tmpLineNormal2.fromAngle(coords[4][0], coords[4][1], tmpLine.normalAngle, (Math.floor(tmpLine.length / 8) + getRandomInt(20)) * sign);

    tmpCircle1.x = tmpLineNormal1.end.x;
    tmpCircle1.y = tmpLineNormal1.end.y;
    tmpCircle2.x = tmpLineNormal2.end.x;
    tmpCircle2.y = tmpLineNormal2.end.y;


    var tmp1 = Math.floor(tmpLine.length / 4);
    var tmp2 = Math.floor(tmpLine.length / 8)

    var pointsArray = [];
    pointsArray[0] = {x:sprite.world.x, y:sprite.world.y};
    pointsArray[1] = {x:tmpLineNormal1.end.x, y:tmpLineNormal1.end.y};
    pointsArray[2] = {x:tmpLineNormal2.end.x,  y:tmpLineNormal2.end.y};
    pointsArray[3] = {x:destX, y: destY};

    tween = game.add.tween(sprite.position).to({   x: [pointsArray[0].x, pointsArray[1].x, pointsArray[2].x, pointsArray[3].x],
        y: [pointsArray[0].y, pointsArray[1].y, pointsArray[2].y, pointsArray[3].y]}, duration,Phaser.Easing.Linear.Out, true, 0, 0).interpolation(function(v, k) {
        return Phaser.Math.bezierInterpolation(v, k);
    });

    if(callbackOnComplete != null)
        tween.onComplete.add(callbackOnComplete, callbackOnCompleteParams);
};

function createIngameText(x, y, text, fntSize)
{
    var _fntSize = fntSize || '25';

    var txtObj = new Phaser.Text(game, x, y, text, {fill:'#FFFFFF', font:_fntSize + 'px gameFont'});
    txtObj.anchor.x = getCorrectAnchorX(txtObj, 0.5);
    txtObj.anchor.y = getCorrectAnchorY(txtObj, 0.5);
    txtObj.shadowOffsetX = 3;
    txtObj.shadowOffsetY = 3;
    txtObj.shadowColor = '#660000';

    return txtObj;
};

function createResultText(x, y, text, fntSize)
{
    var _fntSize = fntSize || '25';

    var txtObj = new Phaser.Text(game, x, y, text, {fill:'#ffffff', font:_fntSize + 'px gameFont'});
    txtObj.anchor.x = getCorrectAnchorX(txtObj, 0.5);
    txtObj.anchor.y = getCorrectAnchorY(txtObj, 0.5);
    txtObj.shadowOffsetX = 2;
    txtObj.shadowOffsetY = 2;
    txtObj.shadowColor = '#5b2121';
    txtObj.shadowFill = '#5b2121';

    return txtObj;
};

function createButtonWithIcon(group, x, y, iconIdx, callback)
{
    var btnObj = group.create(x, y, 'pak1', 'button_0.png');
    btnObj.anchor.set(0.5);
    btnObj.inputEnabled = true;
    AddButtonEvents(btnObj, callback, ButtonOnInputOver, ButtonOnInputOut);

    var btnIcon = new Phaser.Sprite(game, 0, -3, 'pak1', 'icons_' + iconIdx + '.png');
    btnIcon.anchor.set(0.5)
    btnObj.addChild(btnIcon);

    return btnObj;
};

function createInstructionsText(x, y, text, wrapWidth)
{
    var txtObj = new Phaser.Text(game, x, y, text, {fill:'#FFFFFF', font:'24px gameFont', wordWrap: true, wordWrapWidth:  wrapWidth, align: 'center'});
    txtObj.anchor.x = getCorrectAnchorX(txtObj, 0.5);
    txtObj.anchor.y = getCorrectAnchorY(txtObj, 0.5);
    txtObj.shadowOffsetX = 2;
    txtObj.shadowOffsetY = 2;
    txtObj.shadowColor = '#555555';
    txtObj.shadowFill = '#555555';

    return txtObj;
};

function tweenTint(obj, startColor, endColor, time)
{
    // create an object to tween with our step value at 0
    var colorBlend = {step: 0};
    // create the tween on this object and tween its step property to 100
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);
    // run the interpolateColor function every time the tween updates, feeding it the
    // updated value of our tween each time, and set the result as our tint
    colorTween.onUpdateCallback(function () { obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step); });
    // set the object to the start color straight away
    obj.tint = startColor;
    // start the tween
    colorTween.start();
};

function tweenBackgroundColor(obj, startColor, ecR, ecG, ecB, time)
{
    // create an object to tween with our step value at 0
    var colorBlend = {step: 0};
    // create the tween on this object and tween its step property to 100
    var colorTween = game.add.tween(colorBlend).to({step: 10}, time);
    // run the interpolateColor function every time the tween updates, feeding it the
    // updated value of our tween each time, and set the result as our tint
    colorTween.onUpdateCallback(function () { obj.backgroundColor = Phaser.Color.interpolateColorWithRGB(startColor, ecR, ecG, ecB, 10, colorBlend.step); });
    // set the object to the start color straight away
    obj.backgroundColor = startColor;
    // start the tween
    colorTween.start();
};

function removeObjectTweens(obj)
{
    // tweeny mazem takto, lebo game.tweens.removeFrom(obj, true); nemaze scale tweeny

    var removeScaleTWN = function (sprt) {
        game.tweens.removeFrom(sprt.scale, true);
    };

    var removeIndiTWN = function (sprt) {
        if (sprt.scaleObj !== undefined) game.tweens.removeFrom(sprt.scaleObj, true);
    };

    var checkChilds = function (parent) {
        for (var i = 0; i < parent.children.length; i++){
            removeScaleTWN(parent.getChildAt(i));
            removeIndiTWN(parent.getChildAt(i));

            if (parent.getChildAt(i).children.length > 0){
                checkChilds(parent.getChildAt(i));
            }
        }
    };

    checkChilds(obj);

    game.tweens.removeFrom(obj, true);
    removeScaleTWN(obj);
    removeIndiTWN(obj);

};

function millisecondsToTimeStr(millis)
{
    var secs  = Math.floor(millis / 1000);
    var mins  = Math.floor(secs / 60);

    secs -= mins * 60;

    var hours = Math.floor(mins / 60);
    mins -= hours * 60;


    return leadingZero(hours, 0) + ':' + leadingZero(mins, 2) + ':' + leadingZero(secs, 2);
};

function getUrlParameterByName(name, url)
{
    url = url || window.location.href;

    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getCountOfNumberInArray(arr, num)
{
    var cnt = 0;
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == num)
            cnt++;
    }

    return cnt;
}

function getFirstOtherNumberFromArray(arr, num)
{
    var cnt = 0;
    for(var i = 0; i < arr.length; i++){
        if(arr[i] != num)
            return arr[i];
    }

    return num;
}

function setAllNonZeroNumbers(arr, num)
{
    var cnt = 0;
    for(var i = 0; i < arr.length; i++){
        if(arr[i] != 0)
            arr[i] = num;
    }

    return arr;
}

function selectRandomOtherNum(arr, num)
{
    var tmp = [];
    for(var i = 0; i < arr.length; i++){
        if(arr[i] != num)
            tmp.push(arr[i]);
    }

    return(tmp[getRandomUInt(tmp.length)]);
}

function isLevelOfType(type)
{
    return(Levels[selectedLevel].type.indexOf(type) != -1);
}

function getSuggestedFPS()
{
    var retVal = game.time.suggestedFps;

    if(retVal > 60) retVal = 60;
    if(retVal < 20) retVal = 20;
    if(!isNumeric(retVal)) retVal = 30;

    //retVal = 20;

    return retVal;
};

function getCpuSpeedMul()
{
    var tmp = (_elapsedMS() / 16.6666);
    return tmp;
};

var slowTimeFactor = 1;

function gameTimeDelta()
{
    game.time.advancedTiming = true;
    var retVal = 1.0 / game.time.fps / slowTimeFactor;
    if(!isNumeric(retVal)) retVal = 1.0 / 60 / slowTimeFactor;

    return retVal;
};

function _elapsedMS()
{
    //return gameTimeDelta() * 1000;
    return game.time.physicsElapsedMS;
};