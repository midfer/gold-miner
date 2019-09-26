import { EXComponent } from '../common/interface/engine/ex-component';
import { ccclass } from '../ccengine';

@ccclass
export class Persist extends EXComponent {
    protected onLoad(): void {
        cc.game.addPersistRootNode(this.node);
    }
}