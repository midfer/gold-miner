import { EXComponent } from '../interface/engine/ex-component';
import { ccclass, property } from '../ccengine';
import { Catchable } from '../interface/game/catchable';

@ccclass
export class MapItem extends EXComponent implements Catchable {
    @property
    public weight: number = 1;      // 重量
    @property
    public point: number = 0;       // 分数

    public beenCaught(): void {

    }
}