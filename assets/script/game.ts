import { EventMgr } from './manager/event-mgr';

/*
 * Description:
 * File: game.ts
 * Date: 2019-08-22 16:15:02
 * Author: midf
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class Game extends cc.Component {
    @property
    public debug: boolean = false;

    protected onLoad(): void {
        cc.game.addPersistRootNode(this.node);
        this.setupCollisionSystem();
        this.setupManagers();
    }

    protected start(): void {

    }

    protected update(dt: number): void {

    }

    private setupCollisionSystem(): void {
        let collisionMgr = cc.director.getCollisionManager();
        collisionMgr.enabled = true;
        collisionMgr.enabledDebugDraw = this.debug;
    }

    private setupManagers(): void {
        EventMgr.setup();
    }
}
