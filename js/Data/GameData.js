var GameData = function()
{
};

GameData.BuildTitle     = 'Puzzle Pieces';
GameData.BuildVersion   = '1.0.0';
GameData.BuildString    = '10.5.2021 11:24';
GameData.BuildDebug     = false;

GameData.Copyright      = 'Inlogic Software 2021';

GameData.ProfileName    = 'inl-slcs';

console.info('%c %c   ' + GameData.Copyright + ' | ' + GameData.BuildTitle + ' ' + GameData.BuildVersion + ' | ' + GameData.BuildString + '  %c ','background:#353AFB', 'background:#000080;color:#fff', 'background:#353AFB');

var DataVersion  = 0.3;
var PlayerGems   = 0;
var LevelFlags   = [];

GameData.Reset = function()
{
    DataVersion  = 0.3;
    PlayerGems   = 0;
    LevelFlags   = [];

    for(var x = 0; x < 45; x++ )
        LevelFlags[x] = 0;

    LevelFlags[0] = 1;
};

GameData.Load = function()
{
    GameData.Reset();

    var profile = null;

    try{
        profile = JSON.parse(localStorage.getItem(GameData.ProfileName));
    }catch(e){}

    //PPS_USE-GAMEPIX
    /*
    profile = GamePix.localStorage.getItem('pzlpczinl');
    //PPS_USE-GAMEPIX
    */

    //PPS_USE-GRANDTECHNOLOGY
    /*
    profile = JSON.parse(getPlayITsavedDataVar('pzlpczinl'));
    //PPS_USE-GRANDTECHNOLOGY
    */

    try{
        if(profile['DataVersion'] != DataVersion){
            GameData.Save();
            return;
        }

        PlayerGems = profile['PlayerGems'];
        LevelFlags = profile['LevelFlags'];
    }catch(e){
        GameData.Reset();
        GameData.Save();
    }

    //PlayerDaily = Date.now() + 10000;
};

GameData.Save = function()
{
    var profile = {};

    profile['DataVersion'] = DataVersion;
    profile['PlayerGems'] = PlayerGems;
    profile['LevelFlags'] = LevelFlags;

    try{
        localStorage.setItem(GameData.ProfileName, JSON.stringify(profile));
    }catch(e){
    }

    //PPS_USE-GAMEPIX
    /*
    GamePix.localStorage.setItem("pzlpczinl", profile);
    //PPS_USE-GAMEPIX
    */

    //PPS_USE-GRANDTECHNOLOGY
    /*
    savePlayItData({'pzlpczinl': JSON.stringify(profile)});
    //PPS_USE-GRANDTECHNOLOGY
    */
};


/*

X presunúť goal napravo
X obmedziť spawnovanie dvojdielnych kúskov v strede hracej plochy (je ich niekedy až priveľa a sú dôvodom prečo nastáva stav "out of moves")
X out of moves obrazovka nie je veľmi zrozumiteľná (stred plochy kde je dielik, čo nikde nepasuje je zakrytý)

O vymeniť smer scrollu v level selecte
O "second chance" text nahradiť "out of moves"
O zjednotiť grafiku diamantov
O zjednotiť ikony a texty spolu s ich umiestnením v onboarding obrazovke
O ciferný odpočet na points
O Timer je v leveli 2 nejaký tmavý, poriadne ani nie je vidno v akej farbe je
O pri uplynutí času v mode "skore + čas" nie je vôbec jasné, prečo som vlastne prehral (zobrazí sa second chance obrazovka), je potrebné nejako zvýrazniť to, že ti dochádza čas
O môže sa časovač pri zničení nejakých dielikov na ploche postupne naplniť?
O level 9 odpaľovať aj v tomto mode susediace kruhy?
O do bonus levelov pridať dieliky s textúrami
O v level selecte vizuálne odlíšiť zamknutý/odomknutý/dokončený level
O string pri bonuse nefunguje v onboarding obrazovke
O ak je to level s časovanými kruhmi (pridať ich aj do onboarding obrazovky)
O timer na časovaných kruhoch sa niekedy po prirátaní času náhodne zastaví

- do bonus levelov pridať extra diamanty do rewardu
- v level selecte je možné klikať na 2 následujúce zakmnuté levely

- pripraviť texty pre onboarding
 */

/*

O nezobrazovať +X číslo v mode, kde vyskladávaš tvary,
O ak odpáliš nesprávny kruh, nepriratávať bonusový čas,
O znížiť hodnotu pre bonusový čas po odpálení kruhu o 1s,
O timer sa niekedy bugne pri pauznutí hry (klikom na inú obrazovku) v móde vyskladat tvar X Y a limitovany časom Y,
O vyskladat tvar X Y a limitovany časom Y ničiť aj vedľajšie kruhy,
O rozlíšiť animáciu medzi rozbitím kruhu a správnym vyskladaním obrazca
O čo robí LT_DISKS_TIMER?
X pri použití boostru sa ku skóre neprirátajú zničené kúsky,
O pridať screenshake na odpálenie kruhu,
O v bonusových leveloch sa nesprávne zobrazuje string kde je číslo aktuálneho levelu (nemá tam byť level 102 ale BONUS),
O vieme používať kúsky s textúrami?
O chybaju disky v onboardingu pre bonusove levely,
O pri prechádzaní medzi levelmi pomocou tlačidla continue v result screene hra preskakuje bonusové levely,
O použitie continue neodrátava diamanty,
O ak som out of moves a zaplatím continue (v strede boardu musí byť dielik čo na 100% niekam pasuje)
O zablikať daným kruhom na červeno, ak naň neviem presunúť dielik zo stredu,

O Zabugované časovače v B4, prípadne v repeatovanom levely
O Zo 6 skoči na 7 a následne sa vracia B2 ktorý je medzi 6/7
O Z 10 skoči na 11 a následne sa vracia B3 ktorý je medzi 9/10
O B6,B7 to isté atď....
O 31 zle ukazuje hore predlohu
O Zle sa kliká na kruhy na prepinanie strán v level menu >>> zvačšiť collider
O Po skompletizovaniu kruhu preblikne iný kruh – hráč môže tak nechcene položiť iný ako tam bol pôvodne

- upozorniť hráča aby použil boostre, ak ďalší dielik spôsobí out of moves screen,
- pridať napätie ak sa timer blíži ku koncu,
- zmeniť grafiku na boostre resp. na ne upozorniť nejako,

 */