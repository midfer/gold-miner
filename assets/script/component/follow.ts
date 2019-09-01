/*
 * Description: 跟随组件
 * File: follow.ts
 * Date: 2019-08-31 16:30:35
 * Author: midf
 */

import { EXComponent } from './../define/engine/ex-component';
import { ccclass, XVec2, XNode } from '../ccengine';

@ccclass
export class Follow extends EXComponent {
    public speed: number = 0;
    public target: XNode;

    public bind(target: XNode): void {
        this.target = target;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    protected onLoad(): void {
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
        if (this.target) {
            this.follow();
        }
    }

    private follow(): void {
        let velocity: XVec2 = this.target.position.sub(this.node.position).normalizeSelf();
        this.node.x += velocity.x * this.speed;
        this.node.y += velocity.y * this.speed;
    }
}