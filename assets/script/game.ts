/*
* Description:
* File: game.ts
* Date: 2019-08-22 16:15:02
* Author: midf
*/

import { EventMgr } from './manager/event-mgr';
import { xSystemEvent, XSystemEvent, XEvent, XCollisionManager, ccclass, property, XEventKeyboard, XMacro } from './ccengine';
import { EXComponent } from './common/interface/engine/ex-component';
import { XUIEvent } from './common/define/event/ui-event';

@ccclass
export class Game extends EXComponent {
    @property
    public debug: boolean = false;

    protected onLoad(): void {
        this.setupCollisionSystem();
        this.setupManagers();
    }

    protected start(): void {
        xSystemEvent.on(XSystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected update(dt: number): void {
        super.update(dt);
    }

    private setupCollisionSystem(): void {
        let collisionMgr: XCollisionManager = cc.director.getCollisionManager();
        collisionMgr.enabled = true;
        collisionMgr.enabledDebugDraw = this.debug;
    }

    private setupManagers(): void {
        EventMgr.setup();
    }

    private onKeyDown(event: XEventKeyboard): void {
        switch (event.keyCode) {
            case XMacro.KEY.space:
                EventMgr.dispatch(XUIEvent.ClickEmitBtn);
                break;
        }
    }
}
