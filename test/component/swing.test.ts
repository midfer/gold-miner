/*
 * Description: swing组件的单元测试
 * File: swing.test.ts
 * Date: 2019-08-26 10:50:01
 * Author: midf
 */

import { MXComponent } from '../../assets/script/mock/mock-ccengine';
import { SwingDirection, Swing } from '../../assets/script/component/swing';

jest.mock('../../assets/script/ccengine', () => {
    return {
        XComponent: MXComponent,
    };
});

describe('updateNodeAngle', () => {
    test('顺时针摆动时node的角度应该减小', () => {
        let sw: any = new Swing();
        let srcAngle = 30;
        sw.node.angle = srcAngle;
        sw.direction = SwingDirection.Clockwise;

        sw.updateNodeAngle();
        expect(sw.node.angle).toBeLessThan(srcAngle);
    });
    test('逆时针摆动时node的角度应该变大', () => {
        let sw: any = new Swing();
        let srcAngle = 30;
        sw.node.angle = srcAngle;
        sw.direction = SwingDirection.CounterClockwise;

        sw.updateNodeAngle();
        expect(sw.node.angle).toBeGreaterThan(srcAngle);
    });
});

describe('updateSwingDirection', () => {
    test('如果node的角度超过摆动范围时，摆动方向应该变为反方向(顺时针)', () => {
        let sw: any = new Swing();
        let swingRange = 90;
        sw.node.angle = -sw.swingRange;
        sw.swingRange = swingRange;
        sw.direction = SwingDirection.Clockwise;

        sw.updateSwingDirection();
        expect(sw.direction).not.toEqual(SwingDirection.Clockwise);
    });
    test('如果node的角度超过摆动范围时，摆动方向应该变为反方向(逆时针)', () => {
        let sw: any = new Swing();
        let swingRange = 90;
        sw.node.angle = sw.swingRange;
        sw.swingRange = swingRange;
        sw.direction = SwingDirection.CounterClockwise;

        sw.updateSwingDirection();
        expect(sw.direction).not.toEqual(SwingDirection.CounterClockwise);
    });
});

describe('swingNode', () => {
    test('updateNodeAngle和updateSwingDirection应该各自被调用一次', () => {
        let sw: any = new Swing();
        const spyUpdataAngle = jest.spyOn(sw, 'updateNodeAngle');
        const spyUpdateDirection = jest.spyOn(sw, 'updateSwingDirection');
        sw.swingNode();

        expect(spyUpdataAngle).toBeCalledTimes(1);
        expect(spyUpdateDirection).toBeCalledTimes(1);
    });
});