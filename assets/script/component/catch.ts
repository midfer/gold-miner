/*
* Description: 往返组件
* File: ply.ts
* Date: 2019-08-27 17:48:48
* Author: midf
*/

import { EXComponent } from './../define/engine/ex-component';
import { ccclass, property, XCollider, XVec2 } from '../ccengine';
import { EventMgr } from '../manager/event-mgr';
import { XUIEvent } from '../define/event/ui-event';
import { Follow } from './follow';

@ccclass
export class Ply extends EXComponent {
    @property
    public speed: number = 1;

    @property
    public maxDistance: number = 200;

    private times: number = 1;
    private velocity: XVec2 = XVec2.ZERO;
    private originPos: XVec2;

    public onCollisionEnter(other: XCollider, self: XCollider): void {
        this.back();
        let fwComp: Follow = other.node.getComponent(Follow);
        fwComp.bind(this.node);
        fwComp.setSpeed(this.speed);
    }

    protected onLoad(): void {
        EventMgr.on(XUIEvent.ClickShootBtn, this.go, this);
        this.originPos = this.node.position;
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
        this.updatePosition();
    }

    private updatePosition(): void {
        this.node.x += this.velocity.x * this.speed;
        this.node.y += this.velocity.y * this.speed;

        if (this.exceedMaxDistance()) {
            this.back();
        }
    }

    private exceedMaxDistance(): boolean {
        let dist: number = this.originPos.sub(this.node.position).mag();
        return dist > this.maxDistance;
    }

    private go(): void {
        if (!this.velocity.equals(XVec2.ZERO)) {
            return;
        }

        let vec: XVec2 = new XVec2(0, -1);
        vec.rotateSelf(this.node.angle * Math.PI / 180);
        this.velocity = vec;
    }

    private back(): void {
        this.velocity.negSelf();
    }
}