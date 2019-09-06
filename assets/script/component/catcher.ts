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
import { MapItem } from './map-item';
import { XGameEvent } from '../define/event/game-event';

export enum CatcherState {
    idle,
    going,
    backing,
    collecting,
}

@ccclass
export class Catcher extends EXComponent {
    @property
    public speed: number = 1;
    @property
    public maxDistance: number = 200;

    private velocity: XVec2 = XVec2.ZERO;
    private originPos: XVec2;
    private target: MapItem;
    private state: CatcherState = CatcherState.idle;

    public getSpeed(): number {
        if (this.target) {
            return this.speed / this.target.weight;
        }

        return this.speed;
    }

    public onCollisionEnter(other: XCollider, self: XCollider): void {
        this.catchSomething(other.node);
        this.collect();
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
        this.updateState();
    }

    private updateState(): void {
        switch (this.state) {
            case CatcherState.going: {
                this.updateSelfPosition();
                if (this.exceedMaxDistance()) {
                    this.back();
                }
                break;
            }
            case CatcherState.backing: {
                this.updateSelfPosition();
                if (this.nearOriginPosition()) {
                    this.renew();
                }
                break;
            }
            case CatcherState.collecting: {
                this.updateSelfPosition();
                this.updateTargetPosition();
                if (this.nearOriginPosition()) {
                    this.completeCollection();
                }
                break;
            }
            default:
                break;
        }
    }

    private catchSomething(node: XNode): void {
        this.target = node.getComponent(MapItem);
        this.target.beenCaught();
    }

    private updateSelfPosition(): void {
        this.node.x += this.velocity.x * this.getSpeed();
        this.node.y += this.velocity.y * this.getSpeed();
    }

    private updateTargetPosition(): void {
        this.target.node.x += this.velocity.x * this.getSpeed();
        this.target.node.y += this.velocity.y * this.getSpeed();
    }

    private nearOriginPosition(): boolean {
        return this.node.position.fuzzyEquals(this.originPos, 0.001);
    }

    private exceedMaxDistance(): boolean {
        let dist: number = this.originPos.sub(this.node.position).mag();
        return dist > this.maxDistance;
    }

    private changeState(state: CatcherState): void {
        if (this.state === state) {
            return;
        }

        this.state = state;
    }

    private go(): void {
        if (!this.velocity.equals(XVec2.ZERO)) {
            return;
        }

        let vec: XVec2 = new XVec2(0, -1);
        vec.rotateSelf(this.node.angle * Math.PI / 180);
        this.velocity = vec;
        this.changeState(CatcherState.going);
    }

    private back(): void {
        this.velocity.negSelf();
        this.changeState(CatcherState.backing);
    }

    private renew(): void {
        this.velocity = XVec2.ZERO;
        this.changeState(CatcherState.idle);
        EventMgr.dispatch(XGameEvent.PlyCompleted);
    }

    private collect(): void {
        this.velocity.negSelf();
        this.changeState(CatcherState.collecting);
    }

    private completeCollection(): void {
        EventMgr.dispatch(XGameEvent.CollectedMapItem, this.target);
        this.renew();
        this.target.node.destroy();
        this.target = null;
    }
}