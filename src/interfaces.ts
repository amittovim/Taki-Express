// These are just for documentation and are not used as part of the logic

interface User {
    cookie: string;
    name: string;
    isPlayer: boolean;
    playerData: Player;
}

interface Card {
    id: number;
    color: CardColorEnum;
    number: CardNumberEnum;
    action: CardActionEnum;
    isHidden: boolean;
    parentPileId: PileIdEnum;
}

interface Pile {
    type: PileIdEnum; // TODO: is this in user?
    cards: Card[];
    isHand: boolean;
    ownerName: User.name; // refers to the player user info // TODO: string or ref?
    singleCardCounter: number;
}

enum PlayerStatusEnum {
    Idle = 'idle', // מחכה לשחקנים שיתחברו
    Playing = 'playing',
    FinishedPlaying = 'finishedPlaying', // ניצח, סיים את הקלפים בידו או הפסיד
    Observer = 'observer' // צופה מן הצד (רואה את כל הקלפים)
}

// players.every(player => player.playerStatus === PlayerStatusEnum.FinishedPlaying);

interface Player {
    isBot: boolean;
    user: User;
    name: string; // or 'Bot';
    pile: Pile;
    playerStatus: PlayerStatusEnum;
}

interface GameState {
    id: number;
    players: Player[];
    currentPlayer: Player;
    piles: Pile[];
    leadingCard: Card;
    actionInvoked: CardActionEnum;
    turnNumber: number; // ?
    movesCounter: number; //?
    twoPlusCounter: number;
    consoleMessage: string;
    gameStatus: GameStatusEnum;
}

interface Game {
    id: number;
    name: string;
    owner: User;
    playersCapacity: number;
    playersEnrolled: number;
    isBotEnabled: boolean;
    currentState: GameState;
    history: GameState[];
    isActive: boolean; // has the game started

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
    Player1Pile = 'Player1Pile',
    Player2Pile = 'Player2Pile',
    Player3Pile = 'Player3Pile',
    Player4Pile = 'Player4Pile',
}

enum PlayerEnum {
    Bot = 'Bot',
    Human = 'Human'
}

enum GameStatusEnum {
    AwaitingPlayers = 'AwaitingPlayers',
    InitializingGame = 'InitializingGame',
    Ongoing = 'Ongoing', // TODO: used to be Ongoing
    Ended = 'Ended',
    // TODO: when we get there
    // RestockingDeckOfCard = 'RestockingDeckOfCard',
}

