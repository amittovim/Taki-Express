const GameStatusEnum = {
    AwaitingPlayers: 'AwaitingPlayers',
    InitializingGame: 'InitializingGame',
    Ongoing: 'Ongoing', // TODO: used to be GameStateChanged
    Ended: 'Ended',
    // TODO: when we get there
    // RestockingDeckOfCard = 'RestockingDeckOfCard',
};

const PileTypeEnum = {
    DrawPile: 'DrawPile',
    DiscardPile: 'DiscardPile',
    HumanPile: 'HumanPile',
    BotPile: 'BotPile'
};

const PlayerEnum = {
    Bot: 'Bot',
    Human: 'Human'
};

const PlayerStatusEnum = {
    Idle: 'idle', // מחכה לשחקנים שיתחברו
    Playing : 'playing',
    FinishedPlaying : 'finishedPlaying', // ניצח, סיים את הקלפים בידו או הפסיד
    Observer : 'observer' // צופה מן הצד (רואה את כל הקלפים)
};

const CardColorEnum = {
    Green: 'green',
    Red: 'red',
    Yellow: 'yellow',
    Blue: 'blue'
};

const PileTypeEnum = {
    DrawPile: 'DrawPile',
    DiscardPile: 'DiscardPile',
    HumanPile: 'HumanPile',
    BotPile: 'BotPile'
};

const CardActionEnum = {
    Taki: 'taki',
    SuperTaki: 'super-taki',
    Stop: 'stop',
    ChangeColor: 'change-color',
    Plus: 'plus',
    TwoPlus: 'two-plus'
};

const CardNumberEnum = {
    One: 1,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9
};











module.exports =  { PlayerStatusEnum , PlayerEnum , PileTypeEnum ,GameStatusEnum ,CardNumberEnum,
    CardActionEnum, CardColorEnum, }