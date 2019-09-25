/*
 * Description:
 * File: input-handler.ts
 * Date: 2019-09-20 13:10:46
 * Author: midf
 */

import { EXComponent } from '../common/interface/engine/ex-component';
import { ccclass, XNode } from '../ccengine';
import { EventMgr } from '../manager/event-mgr';
import { XUIEvent } from '../common/define/event/ui-event';
import { XGameEvent } from '../common/define/event/game-event';

@ccclass
export class InputHandler extends EXComponent {
    public emitCatcher(): void {
        this.node.emit(XGameEvent.EmitCatcher);
    }

    protected onLoad(): void {

    }

    protected start(): void {
        EventMgr.on(XUIEvent.ClickEmitBtn, this.emitCatcher, this);
    }
}