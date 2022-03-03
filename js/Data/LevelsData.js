alert("Hello Guys");
var PRICE_GAME_CLEARED   = 10;
var PRICE_BOOSTER_HAMMER = 50;
var PRICE_BOOSTER_FWD    = 10;

var LEVEL_TIME_SCORE_INC = 200; //1000ms = 1s
var LEVEL_TIME_SECOND_CHANCE = 30000;

var LT_SCORE        = 'LT_SCORE';
var LT_TIMER        = 'LT_TIMER';
var LT_SHAPE        = 'LT_SHAPE';
var LT_DISKS_TIMER  = 'LT_DISKS_TIMER';

//var PIECES_COLORS = [0x000000, 0x00A99D, 0xFF87C9, 0x8434FF, 0x809100, 0x3893D5, 0x34844D];

var PIECES_COLORS = [0x000000, 0xF8FFCA, 0xB6D084, 0x6EC3C1, 0x0D5F8A, 0xC850B0, 0x660A60, 0xF51663, 0xDEB3AD];

/*
1	Yellow Green	0xF8FFCA
2	Chartreuse	    0xB6D084
3	Spearmint	    0x6EC3C1
4	Midnight Blue	0x0D5F8A
5	Pink	        0xC850B0
6	Orchid	        0x660A60
7	Fuchsia	        0xF51663
8	Dusty Rose	    0xDEB3AD
*/

var Levels = [];

Levels[0] = { //ok
    type: [LT_SCORE],
    score: 30,
    color: 1,
    onboarding: true
};

Levels[1] = { //ok
    type: [LT_SCORE, LT_TIMER],
    score: 33,
    color: 2,
    time: 50000
};

Levels[2] = { //ok
    type: [LT_SHAPE],
    goal: [3, 0, 3, 0, 3, 0],
    count: 2
};

//BONUS LEVEL 1 ok
Levels[101] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 36,
    color: 11,
    time: 11000
};

Levels[3] = { //ok
    type: [LT_SHAPE],
    goal: [4, 4, 4, 4, 4, 4],
    count: 3
};

Levels[4] = { //ok
    type: [LT_SCORE],
    score: 36,
    color: 5
};

Levels[5] = { //ok
    type: [LT_SCORE, LT_TIMER],
    score: 39,
    color: 6,
    time: 55000
};

//BONUS LEVEL 2 ok
Levels[102] = {
    type: [LT_SHAPE, LT_DISKS_TIMER],
    goal: [1, 1, 2, 1, 1, 2],
    count: 2,
    time: 25000
};

Levels[6] = { //ok
    type: [LT_SHAPE],
    goal: [2, 2, 2, 2, 2, 2],
    count: 3
};

Levels[7] = { //ok
    type: [LT_SHAPE,LT_TIMER],
    goal: [3, 3, 3, 4, 3, 4],
    count: 3,
    time: 60000
};

Levels[8] = { //ok
    type: [LT_SCORE],
    score: 42,
    color: 3
};

//BONUS LEVEL 3 ok
Levels[103] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 45,
    color: 12,
    time: 11000
};

Levels[9] = { //ok
    type: [LT_SCORE, LT_TIMER],
    score: 45,
    color: 4,
    time: 60000
};

Levels[10] = { //ok
    type: [LT_SHAPE],
    goal: [5, 5, 5, 5, 5, 5],
    count: 4
};

Levels[11] = { //ok
    type: [LT_SHAPE, LT_TIMER],
    goal: [6, 6, 6, 6, 6, 6],
    count: 3,
    time: 60000
};

//BONUS LEVEL 4
Levels[104] = { //ok
    type: [LT_SHAPE, LT_DISKS_TIMER],
    goal: [7, 8, 7, 8, 7, 7],
    count: 4,
    mixColorPerc: 10,
    time: 25000
};

Levels[12] = { //ok
    type: [LT_SCORE],
    score: 48,
    color: 7
};

Levels[13] = { //ok
    type: [LT_SCORE, LT_TIMER],
    score: 51,
    color: 8,
    time: 70000
};

Levels[14] = { //ok
    type: [LT_SHAPE],
    goal: [6, 6, 6, 6, 6, 6],
    count: 3
};

//BONUS LEVEL 5 //ok
Levels[105] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 54,
    color: 13,
    time: 11000
};

Levels[15] = { //ok
    type: [LT_SHAPE],
    goal: [3, 3, 4, 3, 4, 3],
    mixColorPerc: 10,
    count: 4
};

Levels[16] = { //ok
    type: [LT_SCORE],
    score: 54,
    color: 1
};

Levels[17] = { //ok
    type: [LT_SCORE, LT_TIMER],
    score: 57,
    color: 2,
    time: 70000
};

//BONUS LEVEL 6
Levels[106] = {
    type: [LT_SHAPE, LT_DISKS_TIMER],
    goal: [5, 6, 6, 5, 5, 6],
    count: 3,
    mixColorPerc: 10,
    time: 20000
};

Levels[18] = {
    type: [LT_SHAPE],
    goal: [3, 3, 3, 3, 3, 3],
    count: 5
};

Levels[19] = {
    type: [LT_SHAPE, LT_TIMER],
    goal: [7, 8, 8, 7, 8, 8],
    mixColorPerc: 20,
    count: 6,
    time: 120000
};

Levels[20] = {
    type: [LT_SCORE],
    score: 60,
    color: 4
};

//BONUS LEVEL 7
Levels[107] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 63,
    color: 14,
    time: 10000
};

Levels[21] = {
    type: [LT_SCORE, LT_TIMER],
    score: 63,
    color: 5,
    time: 75000
};


Levels[22] = {
    type: [LT_SHAPE],
    goal: [6, 6, 6, 6, 6, 6],
    count: 2
};

Levels[23] = {
    type: [LT_SHAPE],
    goal: [3, 4, 4, 3, 3, 4],
    mixColorPerc: 20,
    count: 5
};

//BONUS LEVEL 8
Levels[108] = {
    type: [LT_SHAPE, LT_TIMER],
    goal: [5, 5, 6, 6, 6, 5],
    count: 4,
    mixColorPerc: 15,
    time: 80000
};

Levels[24] = {
    type: [LT_SCORE],
    score: 66,
    color: 5
};

Levels[25] = {
    type: [LT_SCORE, LT_TIMER],
    score: 69,
    color: 6,
    time: 75000
};

Levels[26] = {
    type: [LT_SHAPE, LT_TIMER],
    goal: [3, 3, 3, 3, 3, 3],
    count: 4,
    time: 35000
};

//BONUS LEVEL 9
Levels[109] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 63,
    color: 15,
    time: 10000
};

Levels[27] = {
    type: [LT_SHAPE],
    goal: [2, 1, 2, 1, 1, 2],
    mixColorPerc: 15,
    count: 5
};

Levels[28] = {
    type: [LT_SCORE],
    score: 72,
    color: 4
};

Levels[29] = {
    type: [LT_SCORE, LT_TIMER],
    score: 75,
    color: 5,
    time: 75000
};

//BONUS LEVEL 10
Levels[110] = {
    type: [LT_SHAPE, LT_TIMER],
    goal: [4, 3, 4, 4, 3, 3],
    count: 5,
    mixColorPerc: 15,
    time: 80000
};

Levels[30] = {
    type: [LT_SHAPE],
    goal: [6, 0, 6, 6, 6, 0],
    count: 6
};

Levels[31] = {
    type: [LT_SHAPE],
    goal: [5, 6, 6, 5, 5, 6],
    mixColorPerc: 25,
    count: 3
};

Levels[32] = {
    type: [LT_SCORE],
    score: 78,
    color: 7
};

//BONUS LEVEL 11
Levels[111] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 81,
    color: 16,
    time: 9000
};

Levels[33] = {
    type: [LT_SCORE, LT_TIMER],
    score: 81,
    color: 8,
    time: 75000
};

Levels[34] = {
    type: [LT_SHAPE],
    goal: [0, 1, 0, 1, 0, 1],
    count: 4
};

Levels[35] = {
    type: [LT_SHAPE],
    goal: [2, 1, 1, 1, 1, 2],
    mixColorPerc: 15,
    count: 5
};

//BONUS LEVEL 12
Levels[112] = {
    type: [LT_SHAPE, LT_DISKS_TIMER],
    goal: [4, 3, 4, 3, 4, 3],
    mixColorPerc: 25,
    count: 4,
    time: 15000
};

Levels[36] = {
    type: [LT_SCORE],
    score: 84,
    color: 2
};

Levels[37] = {
    type: [LT_SCORE, LT_TIMER],
    score: 87,
    color: 3,
    time: 80000
};

Levels[38] = {
    type: [LT_SHAPE],
    goal: [4, 0, 4, 4, 4, 0],
    count: 6
};

//BONUS LEVEL 13
Levels[113] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 90,
    color: 17,
    time: 9000
};

Levels[39] = {
    type: [LT_SHAPE],
    goal: [7, 7, 7, 8, 7, 8],
    mixColorPerc: 15,
    count: 3
};

Levels[40] = {
    type: [LT_SCORE],
    score: 90,
    color: 5
};

Levels[41] = {
    type: [LT_SCORE, LT_TIMER],
    score: 93,
    color: 6,
    time: 80000
};

//BONUS LEVEL 14
Levels[114] = {
    type: [LT_SHAPE, LT_DISKS_TIMER],
    goal: [2, 2, 1, 1, 1, 2],
    mixColorPerc: 20,
    count: 5,
    time: 15000
};

Levels[42] = {
    type: [LT_SHAPE, LT_TIMER],
    goal: [7, 0, 7, 7, 7, 0],
    count: 4,
    time: 30000
};

Levels[43] = {
    type: [LT_SHAPE],
    goal: [4, 3, 3, 4, 4, 3],
    mixColorPerc: 20,
    count: 5
};

Levels[44] = {
    type: [LT_SCORE],
    score: 96,
    color: 8
};

//BONUS LEVEL 15
Levels[115] = {
    type: [LT_SCORE, LT_DISKS_TIMER],
    score: 99,
    color: 18,
    time: 9000
};

/*

Mody:
- dosiahnut skore X
- dosiahnut skore X a limitovany casom Y
- vyskladat tvar X
- vyskladat tvar X Y
- vyskladat tvar X Y a limitovany časom Y
- vyskladat tvar X Y s kruhmi casovanymi Z

Farby:
1	Yellow Green	#F8FFCA
2	Chartreuse	#B6D084
3	Spearmint	 6EC3C1
4	Midnight Blue	#0D5F8A
5	Pink	#C850B0
6	Orchid	#660A60
7	Fuchsia	#F51663
8	Dusty Rose	#DEB3AD

Dvojice farieb:
1 a 2 - Yellow Green A Chartreuse
3 a 4 - Spearmint a Midnight Blue
5 a 6 - Pink a Orchid
7 a 8 - Fuchsia a Dusty Rose

----------------------------------------

Level 1-20
1 - dosiahnut skore 30 F1
2 - dosiahnut skore 36 a limitovany casom Y F2
3 - vyskladat tvar 2x F3
BONUS - vyskladat tvar 2x a limitovany časom Y F34
4 - vyskladat tvar 3x F4
5 - dosiahnut skore 42 F5
6 - dosiahnut skore 48 a limitovany casom Y F6
BONUS - vyskladat tvar 2x s kruhmi casovanymi Z F12
7 - vyskladat tvar 4x F2
8 - vyskladat tvar 5x F34
9 - dosiahnut skore 54 F3
BONUS - vyskladat tvar 3x a limitovany časom Y F56
10 - dosiahnut skore 54 a limitovany casom Y F4
11 - vyskladat tvar 6x F5
12 - vyskladat tvar 2x F6
BONUS - vyskladat tvar 3x s kruhmi casovanymi Z F78
13 - dosiahnut skore 60 F7
14 - dosiahnut skore 66 a limitovany casom Y F8
15 - vyskladat tvar 3x F6
BONUS - vyskladat tvar 4x a limitovany časom Y F12


Level 21-40
16 - vyskladat tvar 4x F34
17 - dosiahnut skore 72 F1
18 - dosiahnut skore 78 a limitovany casom Y F2
BONUS - vyskladat tvar 3x s kruhmi casovanymi Z F56
19 - vyskladat tvar 5x F3
20 - vyskladat tvar 6x F78
21 - dosiahnut skore 84 F4
BONUS - vyskladat tvar 3x a limitovany časom Y F12
22 - dosiahnut skore 84 a limitovany casom Y F5
23 - vyskladat tvar 2x F6
24 - vyskladat tvar 3x F34
BONUS - vyskladat tvar 4x s kruhmi casovanymi Z F56
25 - dosiahnut skore 90 F5
26 - dosiahnut skore 96 a limitovany casom Y F6
27 - vyskladat tvar 4x F3
BONUS - vyskladat tvar 4x a limitovany časom F78
28 - vyskladat tvar 5x F12
29 - dosiahnut skore 102 F4
30 - dosiahnut skore 108 a limitovany casom Y F5
BONUS - vyskladat tvar 5x s kruhmi casovanymi F34


Level 41-60
31 - vyskladat tvar 6x F6
32 - vyskladat tvar 3x F56
33 - dosiahnut skore 112 F7
BONUS - vyskladat tvar 3x a limitovany časom Y F78
34 - dosiahnut skore 118 a limitovany casom Y F8
35 - vyskladat tvar 4x F1
36 - vyskladat tvar 5x F12
BONUS - vyskladat tvar 4x s kruhmi casovanymi Z F34
37 - dosiahnut skore 124 F2
38 - dosiahnut skore 130 a limitovany casom Y F3
39 - vyskladat tvar 6x F4
BONUS - vyskladat tvar 4x a limitovany časom Y F56
40 - vyskladat tvar 3x F78
41 - dosiahnut skore 136 F5
42 - dosiahnut skore 142 a limitovany casom Y F6
BONUS - vyskladat tvar 5x s kruhmi casovanymi Z F12
43 - vyskladat tvar 4x F7
44 - vyskladat tvar 5x F34
45 - dosiahnut skore 148 F8
BONUS - vyskladat tvar 6x a limitovany časom Y F56

 */
