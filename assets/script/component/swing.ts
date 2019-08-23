const {ccclass, property} = cc._decorator;

enum SwingDirection {
    Clockwise = -1,
    CounterClockwise = 1,
}

@ccclass
export class Swing extends cc.Component {
    @property
    public speed: number = 1;                   // 摆动速度
    @property
    public swingRange: number = 90;             // 摆动角度
    @property
    public ms_per_update: number = 20;          // 更新间隔 ms

    private lag: number = 0;
    private direction: number = SwingDirection.Clockwise;

    protected start () {

    }

    protected update (dt: number) {
        this.lag += dt * 1000;
        while (this.lag >= this.ms_per_update) {
            this.fixedUpdate(this.ms_per_update);
            this.lag -= this.ms_per_update;
        }
    }

    protected fixedUpdate(dt: number) {
        this.swingNode();
    }

    private swingNode() {
        if (this.node.angle >= this.swingRange) {
            this.direction = SwingDirection.Clockwise;
        }
        else if (this.node.angle <= -this.swingRange) {
            this.direction = SwingDirection.CounterClockwise;
        }

        this.node.angle += this.direction * this.speed;
    }
}
