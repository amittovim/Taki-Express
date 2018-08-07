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
    id: number;
    type: PileTypeEnum;
    cards: Card[];
    isHand: boolean;
    ownerName:User .name; // refers to the player user info
    singleCardCounter: number;
}

enum PlayerStatusEnum {
    Idle = 'idle', // מחכה לשחקנים שיתחברו
    Playing = 'playing',
    FinishedPlaying = 'finishedPlaying', // ניצח, סיים את הקלפים בידו או הפסיד
    Observer = 'observer' // צופה מן הצד (רואה את כל הקלפים)
}


players.every(player => player.playerStatus === PlayerStatusEnum.FinishedPlaying);

interface Player {
    isBot: boolean;
    user: User or null;
    name: User.name or 'Bot';
    pile: Pile;
    playerStatus: PlayerStatusEnum;
}

interface GameState {
    id: number;
    players: Player[];
    piles: Pile[];
    currentPlayer: Player;
    receivingPileOwner: PileTypeEnum;
    givingPileOwner: PileTypeEnum;

    selectedCard: Card;
    leadingCard: Card;
    actionInvoked: CardActionEnum // TODO: find a better name for this actionInvoked
    turnNumber: number; // ?
    movesCounter: number; //?
    twoPlusCounter: number;
    consoleMessage: string;
    gameStatus: GameStatusEnum;
    gameDirection: 'Clockwise' or 'CounterClockwise'
}

interface Game {
    id: number;
    name: string;
    owner: User;
    playersCapacity : number;
    playersEnrolled: number;
    isBotEnabled: boolean;
    currentState: GameState;
    history: Array of GameState;
    isActive : boolean; // has the game started

}

interface MoveReqState {
    currentPlayer: Player;
    selectedCard: Card;
    leadingCard: Card;
    piles: [DrawPile,{empty},currentPlayerPile] ;
    actionInvoked: CardActionEnum // TODO: find a better name for this actionInvoked
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
    DrawPile    = 'DrawPile',
    DiscardPile = 'DiscardPile',
    PlayerPile = 'PlayerPile',
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

enum PileIdEnum {
    DrawPile = 0,
    DiscardPile = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5
}
