import { XVec2 } from '../../ccengine';
import { Catcher } from '../../component/catcher';

export interface IMovement {
    update(target: any): void;
}

export interface ICatcherMovement extends IMovement {
    goForward(angle: number): void;
    retreat(): void;
    stop(): void;
}

export class CatcherMovement implements ICatcherMovement {
    private direction: XVec2;
    public constructor() {
        this.direction = XVec2.ZERO;
    }

    public goForward(angle: number): void {
        let vec: XVec2 = new XVec2(0, -1);
        this.direction = vec.rotate(angle * Math.PI / 180);
    }

    public retreat(): void {
        this.direction.negSelf();
    }

    public stop(): void {
        this.direction = XVec2.ZERO;
    }

    public update(catcher: Catcher): void {
        catcher.node.x += this.direction.x * catcher.getActualMoveSpeed();
        catcher.node.y += this.direction.y * catcher.getActualMoveSpeed();
    }
}