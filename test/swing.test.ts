import { MXComponent } from "../assets/script/mock/mock-ccengine";
import { SwingDirection, Swing } from "../assets/script/component/swing";

jest.mock('../assets/script/ccengine', () => {
    return {
        XComponent: MXComponent,
    };
});

describe('updateNodeAngle', () => {
    test('顺时针摆动时node的角度减小', () => {
        let sw = new Swing();
        let srcAngle = 30;
        sw.node.angle = srcAngle;
        sw.direction = SwingDirection.Clockwise;

        sw.updateNodeAngle();
        expect(sw.node.angle).toBeLessThan(srcAngle);
    });
    test('逆时针摆动时node的角度变大', () => {
        let sw = new Swing();
        let srcAngle = 30;
        sw.node.angle = srcAngle;
        sw.direction = SwingDirection.CounterClockwise;

        sw.updateNodeAngle();
        expect(sw.node.angle).toBeGreaterThan(srcAngle);
    });
});

describe('updateSwingDirection', () => {
    test('如果node的角度超过摆动范围是，需要将摆动方向变为反方向(顺时针)', () => {
        let sw = new Swing();
        let swingRange = 90;
        sw.node.angle = -sw.swingRange;
        sw.swingRange = swingRange;
        sw.direction = SwingDirection.Clockwise;

        sw.updateSwingDirection();
        expect(sw.direction).not.toEqual(SwingDirection.Clockwise);
    });
    test('如果node的角度超过摆动范围是，需要将摆动方向变为反方向(逆时针)', () => {
        let sw = new Swing();
        let swingRange = 90;
        sw.node.angle = sw.swingRange;
        sw.swingRange = swingRange;
        sw.direction = SwingDirection.CounterClockwise;

        sw.updateSwingDirection();
        expect(sw.direction).not.toEqual(SwingDirection.CounterClockwise);
    });
});