export enum SwingDirection {
    Clockwise = -1,
    CounterClockwise = 1,
}

export interface ISwing {
    update(target: any): void;
}