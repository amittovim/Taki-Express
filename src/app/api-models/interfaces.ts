// These are just for documentation and are not used as part of the logic

interface User {
    cookie: string;
    name: string;
    isPlayer: boolean;
    playerData: Player;
}

interface Card {

}

interface Pile {

}

enum PlayerStatusEnum {
    Idle = 'idle', // מחכה לשחקנים שיתחברו
    Playing = 'playing',
    FinishedPlaying = 'finishedPlaying', // ניצח, סיים את הקלפים בידו או הפסיד
    Observer = 'observer' // צופה מן הצד (רואה את כל הקלפים)
}


players.every(player => player.playerStatus === PlayerStatusEnum.FinishedPlaying);

interface Player {
    pile: Pile;
    isBot: boolean;
    playerStatus: PlayerStatusEnum;
}

interface GameState {
    id: number;
    players: Player[];
    currentPlayer: Player;
    drawPile: Pile;
    discardPile: Pile;
    leadingCard: Card;
    action: CardActionEnum // TODO: find a better name for actionState
    turnNumber: number; // ?
    movesCounter: number; //?
    twoPlusCounter: number;
    consoleMessage: string;
}

interface Game {
    id: number;
    name: string;
    owner: User;
    playersCapacity : number;
    playersEnrolled: number;
    isBotEnabled: boolean;
    currentState: State;
    gameStatus: GameStatusEnum
}

interface NewPlayer {
    user: User;
    name: User.name;
    isActive: boolean;
    isBotEnabled: boolean;
    pile: Pile;

}

interface Player {
    playerType: PlayerEnum;
    pile: Pile;
}

interface Pile {
    type: PileTypeEnum;
    cards: Card[];
    isHand: boolean;
    singleCardCounter: number;
}

interface State {
    discardPile: Pile;
    drawPile: Pile;
    human: Player;
    bot: Player;
    leadingCard: Card;
    currentPlayer: PlayerEnum;
    selectedCard: Card;
    actionState: CardActionEnum;
    turnNumber: number;
    movesCounter: number;
    twoPlusCounter: number;
    gameStatus: GameStatusEnum;
}

interface Card {
    id: number;
    color: CardColorEnum;
    number: CardNumberEnum;
    action: CardActionEnum;
    isHidden: boolean;
    parentPileType: PileTypeEnum;
}

enum CardColorEnum {
    Green = 'green',
    Red = 'red',
    Yellow = 'yellow',
    Blue = 'blue'
}

enum CardNumberEnum {
    One = 1,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9
}

enum CardActionEnum {
    Taki = 'taki',
    SuperTaki = 'super-taki',
    Stop = 'stop',
    ChangeColor = 'change-color',
    Plus = 'plus',
    TwoPlus = 'two-plus'
}

enum PileTypeEnum {
    DrawPile = 'DrawPile',
    DiscardPile = 'DiscardPile',
    HumanPile = 'HumanPile',
    BotPile = 'BotPile'
}

enum PlayerEnum {
    Bot = 'Bot',
    Human = 'Human'
}

enum GameStatusEnum {
    AwaitingPlayers = 'AwaitingPlayers',
    InitializingGame = 'InitializingGame',
    Ongoing = 'Ongoing', // TODO: used to be GameStateChanged
    Ended = 'Ended',
    // TODO: when we get there
    // RestockingDeckOfCard = 'RestockingDeckOfCard',
}

