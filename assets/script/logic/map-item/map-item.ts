import { EXComponent } from '../../common/interface/engine/ex-component';
import { ccclass, property } from '../../ccengine';
import { Catchable } from '../../common/interface/game/catchable';

@ccclass
export class MapItem extends EXComponent implements Catchable {
    @property
    public weight: number = 1;      // 重量
    @property
    public point: number = 0;       // 分数

    public beenCaught(): void {

    }
}