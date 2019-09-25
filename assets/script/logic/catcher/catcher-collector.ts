import { Catcher } from './catcher';
import { XVec2 } from '../../ccengine';

export interface ICatcherCollector {
    update(target: any): void;
}

export class CatcherCollector implements ICatcherCollector {
    public update(catcher: Catcher): void {
        if (!catcher.isCatchingTarget()) {
            return;
        }

        let direction: XVec2 = catcher.node.position.sub(catcher.target.node.position).normalizeSelf();
        catcher.target.node.x += direction.x * catcher.getActualMoveSpeed();
        catcher.target.node.y += direction.y * catcher.getActualMoveSpeed();
    }
}