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
    parentPileId: PileIdEnum;
}

interface Pile {
    id: PileIdEnum;
    cards: Card[];
    isHand: boolean;
    ownerPlayerName: User.name; // refers to the player user info
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
    gameDirection: GameDirectionEnum;
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

interface animateCardInfo {
    cardToMove: Card;
    sourcePileId: PileIdEnum;
    destinationPileId: PileIdEnum;
    sourcePileDOM: DOMObject;
    destinationPileDOM: DOMObject;

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
    TwoPlus = 'two-plus',
    ChangeDirection = 'change-direction'
}

enum PileTypeEnum {
    DrawPile = 'DrawPile',
    DiscardPile = 'DiscardPile',
    Player1Pile = 'Player1Pile',
    Player2Pile = 'Player2Pile',
    Player3Pile = 'Player3Pile',
    Player4Pile = 'Player4Pile',
}

enum PileIdEnum {
    DrawPile= 0,
    DiscardPile= 1,
    Two= 2,
    Three= 3,
    Four= 4,
    Five= 5
}


enum PlayerEnum {
    Bot = 'Bot',
    Human = 'Human'
}

enum GameStatusEnum {
    AwaitingPlayers = 'AwaitingPlayers',
    InitializingGame = 'InitializingGame',
    Ongoing = 'Ongoing',
    Ended = 'Ended',
}

enum GameDirectionEnum {
    Clockwise = 'Clockwise',
    CounterClockwise = 'CounterClockwise'
}
