/*
 * Description: 抓取组件
 * File: catch.ts
 * Date: 2019-09-02 10:19:25
 * Author: midf
 */

import { EXComponent } from '../interface/engine/ex-component';
import { ccclass, property, XCollider, XVec2, XNode } from '../ccengine';
import { MapItem } from './map-item';
import { XGameEvent } from '../define/event/game-event';
import { CatcherSwing, ICatcherSwing } from '../interface/game/swing';
import { ICatcherMovement, CatcherMovement } from '../interface/game/movement';
import { CatcherCollector, ICatcherCollector } from '../interface/game/collector';

export enum CatcherState {
    idle,                       // 空闲状态
    going,                      // 前进状态
    backing,                    // 没抓到东西回来的状态
    collecting,                 // 抓到东西回来的状态
}

export const POSITION_ERROR: number = 0.001;    // 坐标允许误差

@ccclass
export class Catcher extends EXComponent {
    @property
    public swingSpeed: number = 1;
    @property
    public swingRange: number = 90;
    @property
    public moveSpeed: number = 5;
    @property
    public maxDistance: number = 200;

    public target: MapItem;
    private originPos: XVec2;
    private state: CatcherState = CatcherState.idle;

    private swing: ICatcherSwing;
    private movement: ICatcherMovement;
    private collector: ICatcherCollector;

    public getActualMoveSpeed(): number {
        if (this.target) {
            return this.moveSpeed / this.target.weight;
        }

        return this.moveSpeed;
    }

    public isCatchingTarget(): boolean {
        return !!this.target;
    }

    protected onLoad(): void {
        this.storeOriginPosition();
        this.swing = new CatcherSwing();
        this.movement = new CatcherMovement();
        this.collector = new CatcherCollector();
    }

    protected onEnable(): void {
        this.addEventListenter();
    }

    protected onDisable(): void {
        this.removeEventListener();
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
        this.swing.update(this);
        this.movement.update(this);
        this.collector.update(this);
        this.updateState();
    }

    protected onCollisionEnter(other: XCollider, self: XCollider): void {
        this.catchTarget(other.node);
        this.collect();
    }

    private storeOriginPosition(): void {
        this.originPos = this.node.position;
    }

    private addEventListenter(): void {
        this.node.on(XGameEvent.EmitCatcher, this.go, this);
    }

    private removeEventListener(): void {
        this.node.off(XGameEvent.EmitCatcher, this.go, this);
    }

    private moving(): boolean {
        return this.state !== CatcherState.idle;
    }

    private updateState(): void {
        switch (this.state) {
            case CatcherState.going: {
                if (this.exceedMaxDistance()) {
                    this.back();
                }
                break;
            }
            case CatcherState.backing: {
                if (this.nearOriginPosition()) {
                    this.renew();
                }
                break;
            }
            case CatcherState.collecting: {
                if (this.nearOriginPosition()) {
                    this.completeCollection();
                }
                break;
            }
            default:
                break;
        }
    }

    private catchTarget(node: XNode): void {
        this.target = node.getComponent(MapItem);
        this.target.beenCaught();
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
        if (this.moving()) {
            return;
        }

        this.swing.stop();
        this.movement.goForward(this.node.angle);
        this.changeState(CatcherState.going);
    }

    private destroyMapItem(): void {
        this.target.node.destroy();
        this.target = null;
    }

    private back(): void {
        this.movement.retreat();
        this.changeState(CatcherState.backing);
    }

    private renew(): void {
        this.swing.start();
        this.movement.stop();
        this.changeState(CatcherState.idle);
    }

    private collect(): void {
        this.movement.retreat();
        this.changeState(CatcherState.collecting);
    }

    private completeCollection(): void {
        this.renew();
        this.destroyMapItem();
    }
}