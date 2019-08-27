/*
 * Description:
 * File: ply.ts
 * Date: 2019-08-27 17:48:48
 * Author: midf
 */

import { ccclass, property, XComponent } from "../ccengine";
type Collider = cc.Collider;

@ccclass
export class Ply extends XComponent {
    @property
    public speed: number = 1;
    private times: number = 1;

    public onCollisionEnter(other: Collider, self: Collider): void {

    }
}