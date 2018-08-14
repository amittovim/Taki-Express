const GameStatusEnum = {
    AwaitingPlayers: 'AwaitingPlayers',
    InitializingGame: 'InitializingGame',  //used to be 'GameInit'
    SettingStartingCard: 'SettingStartingCard',
    Ongoing: 'Ongoing', // TODO: used to be GameStateChanged
    Ended: 'Ended',
    RestockingDeckOfCard: 'RestockingDeckOfCard'
};

const PileTypeEnum = {
    DrawPile: 'DrawPile',
    DiscardPile: 'DiscardPile',
    PlayerPile: 'PlayerPile',  // used to be HumanPile: 'HumanPile', and BotPile: 'BotPile'
};

const PlayerEnum = { // TODO: const BOT = 'Bot';
    Bot: 'Bot',
    Human: 'Human'
};

const PlayerStatusEnum = {
    Idle: 'idle', // מחכה לשחקנים שיתחברו
    Playing: 'playing',
    FinishedPlaying: 'finishedPlaying', // ניצח, סיים את הקלפים בידו או הפסיד
    Observing: 'observing' // צופה מן הצד (רואה את כל הקלפים)
};

const CardColorEnum = {
    Green: 'green',
    Red: 'red',
    Yellow: 'yellow',
    Blue: 'blue'
};

const CardActionEnum = {
    Taki: 'taki',
    SuperTaki: 'super-taki',
    Stop: 'stop',
    ChangeColor: 'change-color',
    Plus: 'plus',
    TwoPlus: 'two-plus',
    ChangeDirection: 'change-direction'
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

const GameDirection = { // TODO: const isClockwise = false;
    Clockwise: 'Clockwise',
    CounterClockwise: 'CounterClockwise'
};

const PileIdEnum = {
    DrawPile: 0,
    DiscardPile: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5
};

module.exports = {
    PlayerStatusEnum,
    PlayerEnum,
    PileTypeEnum,
    GameStatusEnum,
    CardNumberEnum,
    CardActionEnum,
    CardColorEnum,
    GameDirection,
    PileIdEnum
};
