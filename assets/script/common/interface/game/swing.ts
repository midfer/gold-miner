import { Catcher } from '../../../logic/catcher';
import { XNode } from '../../../ccengine';

export enum SwingDirection {
    Clockwise = -1,
    CounterClockwise = 1,
}

export interface ISwing {
    update(target: any): void;
}

export interface ICatcherSwing extends ISwing {
    start(): void;
    stop(): void;
}

export class CatcherSwing implements ICatcherSwing {
    private direction: SwingDirection;
    private stopped: boolean;
    public constructor(initialDirection: SwingDirection = SwingDirection.Clockwise) {
        this.direction = initialDirection;
        this.stopped = false;
    }

    public update(catcher: Catcher): void {
        this.swing(catcher);
    }

    public start(): void {
        this.stopped = false;
    }

    public stop(): void {
        this.stopped = true;
    }

    private swing(catcher: Catcher): void {
        if (this.stopped) {
            return;
        }

        this.updateDirection(catcher.node, catcher.swingRange);
        this.updateAngle(catcher.node, catcher.swingSpeed);
    }

    private updateDirection(target: XNode, range: number): void {
        if (target.angle >= range) {
            this.direction = SwingDirection.Clockwise;
        }
        else if (target.angle <= -range) {
            this.direction = SwingDirection.CounterClockwise;
        }
    }

    private updateAngle(target: XNode, speed: number): void {
        target.angle += this.direction * speed;
    }
}