export class MXNode {
    angle: number;
    constructor() {
        this.angle = 0;
    }
}

export class MXComponent {
    node: MXNode;
    constructor() {
        this.node = new MXNode();
    }
}