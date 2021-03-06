// alert("Hello Guys");
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

X presun???? goal napravo
X obmedzi?? spawnovanie dvojdielnych k??skov v strede hracej plochy (je ich niekedy a?? prive??a a s?? d??vodom pre??o nast??va stav "out of moves")
X out of moves obrazovka nie je ve??mi zrozumite??n?? (stred plochy kde je dielik, ??o nikde nepasuje je zakryt??)

O vymeni?? smer scrollu v level selecte
O "second chance" text nahradi?? "out of moves"
O zjednoti?? grafiku diamantov
O zjednoti?? ikony a texty spolu s ich umiestnen??m v onboarding obrazovke
O cifern?? odpo??et na points
O Timer je v leveli 2 nejak?? tmav??, poriadne ani nie je vidno v akej farbe je
O pri uplynut?? ??asu v mode "skore + ??as" nie je v??bec jasn??, pre??o som vlastne prehral (zobraz?? sa second chance obrazovka), je potrebn?? nejako zv??razni?? to, ??e ti doch??dza ??as
O m????e sa ??asova?? pri zni??en?? nejak??ch dielikov na ploche postupne naplni???
O level 9 odpa??ova?? aj v tomto mode susediace kruhy?
O do bonus levelov prida?? dieliky s text??rami
O v level selecte vizu??lne odl????i?? zamknut??/odomknut??/dokon??en?? level
O string pri bonuse nefunguje v onboarding obrazovke
O ak je to level s ??asovan??mi kruhmi (prida?? ich aj do onboarding obrazovky)
O timer na ??asovan??ch kruhoch sa niekedy po prir??tan?? ??asu n??hodne zastav??

- do bonus levelov prida?? extra diamanty do rewardu
- v level selecte je mo??n?? klika?? na 2 n??sleduj??ce zakmnut?? levely

- pripravi?? texty pre onboarding
 */

/*

O nezobrazova?? +X ????slo v mode, kde vysklad??va?? tvary,
O ak odp??li?? nespr??vny kruh, neprirat??va?? bonusov?? ??as,
O zn????i?? hodnotu pre bonusov?? ??as po odp??len?? kruhu o 1s,
O timer sa niekedy bugne pri pauznut?? hry (klikom na in?? obrazovku) v m??de vyskladat tvar X Y a limitovany ??asom Y,
O vyskladat tvar X Y a limitovany ??asom Y ni??i?? aj ved??aj??ie kruhy,
O rozl????i?? anim??ciu medzi rozbit??m kruhu a spr??vnym vyskladan??m obrazca
O ??o rob?? LT_DISKS_TIMER?
X pri pou??it?? boostru sa ku sk??re neprir??taj?? zni??en?? k??sky,
O prida?? screenshake na odp??lenie kruhu,
O v bonusov??ch leveloch sa nespr??vne zobrazuje string kde je ????slo aktu??lneho levelu (nem?? tam by?? level 102 ale BONUS),
O vieme pou????va?? k??sky s text??rami?
O chybaju disky v onboardingu pre bonusove levely,
O pri prech??dzan?? medzi levelmi pomocou tla??idla continue v result screene hra preskakuje bonusov?? levely,
O pou??itie continue neodr??tava diamanty,
O ak som out of moves a zaplat??m continue (v strede boardu mus?? by?? dielik ??o na 100% niekam pasuje)
O zablika?? dan??m kruhom na ??erveno, ak na?? neviem presun???? dielik zo stredu,

O Zabugovan?? ??asova??e v B4, pr??padne v repeatovanom levely
O Zo 6 sko??i na 7 a n??sledne sa vracia B2 ktor?? je medzi 6/7
O Z 10 sko??i na 11 a n??sledne sa vracia B3 ktor?? je medzi 9/10
O B6,B7 to ist?? at??....
O 31 zle ukazuje hore predlohu
O Zle sa klik?? na kruhy na prepinanie str??n v level menu >>> zva????i?? collider
O Po skompletizovaniu kruhu preblikne in?? kruh ??? hr???? m????e tak nechcene polo??i?? in?? ako tam bol p??vodne

- upozorni?? hr????a aby pou??il boostre, ak ??al???? dielik sp??sob?? out of moves screen,
- prida?? nap??tie ak sa timer bl????i ku koncu,
- zmeni?? grafiku na boostre resp. na ne upozorni?? nejako,

 */