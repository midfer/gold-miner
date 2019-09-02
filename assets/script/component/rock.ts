import { ccclass, XCollider, property } from '../ccengine';
import { MapItem } from './map-item';

@ccclass
export class Rock extends MapItem {
    public caught(): void {
        super.caught();
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
    }

}