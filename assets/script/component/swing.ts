/*
 * Description: 摆动组件
 * File: swing.ts
 * Date: 2019-08-22 18:17:46
 * Author: midf
 */

import { ccclass, property } from '../ccengine';
import { EXComponent } from '../define/engine/ex-component';
import { EventMgr } from '../manager/event-mgr';
import { XUIEvent } from '../define/event/ui-event';
import { XGameEvent } from '../define/event/game-event';

export enum SwingDirection {
    Clockwise = -1,
    CounterClockwise = 1,
}

@ccclass
export class Swing extends EXComponent {
    @property
    public speed: number = 1;                   // 摆动速度
    @property
    public swingRange: number = 90;             // 摆动角度

    private direction: number = SwingDirection.Clockwise;
    private stopped: boolean = false;

    protected onLoad(): void {
        EventMgr.on(XUIEvent.ClickShootBtn, this.stopSwing, this);
        EventMgr.on(XGameEvent.PlyCompleted, this.startSwing, this);
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    protected fixedUpdate(dt: number): void {
        super.fixedUpdate(dt);
        this.swingNode();
    }

    private swingNode(): void {
        if (this.stopped) {
            return;
        }

        this.updateSwingDirection();
        this.updateNodeAngle();
    }

    private updateSwingDirection(): void {
        if (this.node.angle >= this.swingRange) {
            this.direction = SwingDirection.Clockwise;
        }
        else if (this.node.angle <= -this.swingRange) {
            this.direction = SwingDirection.CounterClockwise;
        }
    }

    private updateNodeAngle(): void {
        this.node.angle += this.direction * this.speed;
    }

    private startSwing(): void {
        this.stopped = false;
    }

    private stopSwing(): void {
        this.stopped = true;
    }
}
