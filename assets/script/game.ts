/*
 * Description:
 * File: game.ts
 * Date: 2019-08-22 16:15:02
 * Author: midf
 */

const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {
    @property
    debug: boolean = false;

    onLoad () {
        this.setupCollisionSystem();
    }

    start () {

    }

    update (dt: number) {

    }

    private setupCollisionSystem(): void {
        let collisionMgr = cc.director.getCollisionManager();
        collisionMgr.enabled = true;
        collisionMgr.enabledDebugDraw = this.debug;
    }
}
