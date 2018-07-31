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

module.exports =  { PlayerStatusEnum , PlayerEnum , PileTypeEnum ,GameStatusEnum }