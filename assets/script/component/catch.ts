/*
 * Description: 抓取组件
 * File: catch.ts
 * Date: 2019-09-02 10:19:25
 * Author: midf
 */

import { EXComponent } from './../define/engine/ex-component';
import { ccclass, property, XCollider, XVec2, XNode } from '../ccengine';
import { EventMgr } from '../manager/event-mgr';
import { XUIEvent } from '../define/event/ui-event';
import { Follow } from './follow';
import { MapItem } from './map-item';

@ccclass
export class Catch extends EXComponent {
    @property
    public speed: number = 1;
    @property
    public maxDistance: number = 200;

    private velocity: XVec2 = XVec2.ZERO;
    private originPos: XVec2;
    private target: MapItem;

    public getSpeed(): number {
        if (this.target) {
            return this.speed / this.target.weight;
        }

        return this.speed;
    }

    public onCollisionEnter(other: XCollider, self: XCollider): void {
        this.back();
        this.target = other.node.getComponent(MapItem);
        this.target.caught();
    }

    protected onLoad(): void {
        this.originPos = this.node.position;
        EventMgr.on(XUIEvent.ClickShootBtn, this.go, this);
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
        this.updatePosition();
    }

    private updatePosition(): void {
        this.node.x += this.velocity.x * this.getSpeed();
        this.node.y += this.velocity.y * this.getSpeed();
        if (this.target) {
            this.target.node.x += this.velocity.x * this.getSpeed();
            this.target.node.y += this.velocity.y * this.getSpeed();
        }

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