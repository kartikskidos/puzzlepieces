
function AddButtonEvents(btn, onInputDown, onInputOver, onInputOut, onInputUp)
{
    if(onInputUp === undefined)
        onInputUp = null;

    btn.inputEnabled = true;
    btn.buttonPressed = false;
    btn.onInputOut = onInputOut;
    btn.onInputUp = onInputUp;
    btn.events.onInputDown.add(ButtonOnInputDown, {button: btn, callback: onInputDown});
    btn.events.onInputOver.add(onInputOver, {button: btn});
    btn.events.onInputOut.add(onInputOut, {button: btn});

    if(onInputUp != null)
        btn.events.onInputUp.add(onInputUp, {button: btn});
};

function ButtonOnInputDown()
{
    if(ScenesTransitions.transitionActive)
        return;

    if(this.button.hasOwnProperty('spriteHighlighted'))
        this.button.spriteHighlighted.tint = 0xFFFFFF;

    this.button.tint = 0xFFFFFF;
    if(this.callback != null)  this.callback();
    this.button.onInputOut(this.button);
    this.button.buttonPressed = true;
    this.button.buttonPressedTime = game.time.totalElapsedSeconds();
};

function ButtonOnInputOver(btn)
{
    btn = btn || this.button;

    if (!Phaser.Device.desktop)
        return;
    if (btn.overFrame === undefined){
        if(btn.hasOwnProperty('spriteHighlighted'))
            btn.spriteHighlighted.tint = 0x999999;
        btn.tint = 0x999999;
    }
    else
        btn.frameName = btn.overFrame;

    btn.cachedTint = -1;
};

function ButtonOnInputOut(btn)
{
    btn = btn || this.button;

    if (!Phaser.Device.desktop)
        return;
    if (btn.outFrame === undefined){
        if(btn.hasOwnProperty('spriteHighlighted'))
            btn.spriteHighlighted.tint = 0xFFFFFF;
        btn.tint = 0xFFFFFF;
    }
    else
        btn.frameName = btn.outFrame;

    btn.cachedTint = -1;

    if(btn.buttonPressed){
        btn.buttonPressed = false;

        if(btn.onInputUp != null)
            btn.onInputUp(btn);
    }
}
