/*
 * Description: 往返组件
 * File: ply.ts
 * Date: 2019-08-27 17:48:48
 * Author: midf
 */

import { ccclass, property, XComponent, XCollider } from '../ccengine';
import { EventMgr } from '../manager/event-mgr';
import { XUIEvent } from '../../define/event/ui-event';


@ccclass
export class Ply extends XComponent {
    @property
    public speed: number = 1;
    private times: number = 1;

    public onCollisionEnter(other: XCollider, self: XCollider): void {

    }
}