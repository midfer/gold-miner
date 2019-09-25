import { ccclass } from '../../ccengine';
import { MapItem } from './map-item';

@ccclass
export class MysteryBag extends MapItem {
    public beenCaught(): void {
        super.beenCaught();
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
    }
}