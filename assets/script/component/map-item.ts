import { EXComponent } from '../define/engine/ex-component';
import { ccclass, property } from '../ccengine';
import { Catchable } from '../interface/catchable';

@ccclass
export class MapItem extends EXComponent implements Catchable {
    @property
    public weight: number = 1;

    public beenCaught(): void {

    }
}