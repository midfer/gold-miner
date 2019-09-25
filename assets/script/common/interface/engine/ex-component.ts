/*
* Description:
* File: ex-component.ts
* Date: 2019-08-31 14:13:49
* Author: midf
*/

import { XComponent } from '../../../ccengine';

export class EXComponent extends XComponent {
    protected ms_per_update: number = 20;          // 更新间隔 ms
    protected lag: number = 0;

    protected update(dt: number): void {
        this.lag += dt * 1000;
        while (this.lag >= this.ms_per_update) {
            this.fixedUpdate(this.ms_per_update);
            this.lag -= this.ms_per_update;
        }
    }

    protected fixedUpdate(dt: number): void {

    }
}