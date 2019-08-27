/*
 * Description: 摆动组件
 * File: swing.ts
 * Date: 2019-08-22 18:17:46
 * Author: midf
 */
import { ccclass, property, XComponent } from "../ccengine";

export enum SwingDirection {
    Clockwise = -1,
    CounterClockwise = 1,
}

@ccclass
export class Swing extends XComponent {
    @property
    public speed: number = 1;                   // 摆动速度
    @property
    public swingRange: number = 90;             // 摆动角度
    @property
    public ms_per_update: number = 20;          // 更新间隔 ms

    public lag: number = 0;
    public direction: number = SwingDirection.Clockwise;

    protected start (): void {

    }

    protected update (dt: number): void {
        this.lag += dt * 1000;
        while (this.lag >= this.ms_per_update) {
            this.fixedUpdate(this.ms_per_update);
            this.lag -= this.ms_per_update;
        }
    }

    protected fixedUpdate(dt: number): void {
        // this.swingNode();
    }

    private swingNode(): void {
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
}
