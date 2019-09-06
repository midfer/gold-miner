
import { createComponent } from '../utils';
import { Catcher } from '../../assets/script/component/catcher';
import { XVec2 } from '../../assets/script/ccengine';

describe('go', () => {
    var comp: Catcher;
    beforeEach(() => {
        comp = createComponent(Catcher);
    });

    test('角度为45时，速度应该近似等于Vec(1, -1).normalize()', () => {
        comp.node.angle = 45;
        let result = new XVec2(1, -1).normalize();

        comp['go']();
        expect(comp['velocity'].x).toBeCloseTo(result.x);
        expect(comp['velocity'].y).toBeCloseTo(result.y);
    });

    test('角度为-45时，速度应该近似等于Vec(-1, -1).normalize()', () => {
        comp.node.angle = -45;
        let result = new XVec2(-1, -1).normalize();

        comp['go']();
        expect(comp['velocity'].x).toBeCloseTo(result.x);
        expect(comp['velocity'].y).toBeCloseTo(result.y);
    });

    test('如果当前速度不为Vec(0, 0)，不应该改变原来的速度', () => {
        comp.node.angle = 23;
        let origin = new XVec2(1, -1).normalize();
        comp['velocity'] = origin.clone();

        comp['go']();
        expect(comp['velocity'].x).toBeCloseTo(origin.x);
        expect(comp['velocity'].y).toBeCloseTo(origin.y);
    });
});

describe('back', () => {
    var comp: Catcher;
    beforeEach(() => {
        comp = createComponent(Catcher);
    });

    test('速度应该变为反方向', () => {
        let result = new XVec2(-1, 1).normalize();
        comp['velocity'] = new XVec2(1, -1).normalize();

        comp['back']();
        expect(comp['velocity'].x).toBeCloseTo(result.x);
        expect(comp['velocity'].y).toBeCloseTo(result.y);
    });
});

describe('exceedMaxDistance', () => {
    var comp: Catcher;
    beforeEach(() => {
        comp = createComponent(Catcher);
        comp['originPos'] = new XVec2(0, 0);
    });

    test('当前位置超过可移动的最大距离时应该返回true', () => {
        comp.node.position = new XVec2(200, 300);
        comp.maxDistance = 200;

        expect(comp['exceedMaxDistance']()).toEqual(true);
    });

    test('当前位置不超过可移动的最大距离时应该返回false', () => {
        comp.node.position = new XVec2(50, 50);
        comp.maxDistance = 200;

        expect(comp['exceedMaxDistance']()).toEqual(false);
    });
});

describe('updateSelfPosition', () => {
    var ply: any;
    beforeEach(() => {
        ply = createComponent(Catcher);
        ply['originPos'] = new XVec2(0, 0);
        ply.speed = 10;
        ply.maxDistance = 200;
        ply.node.position = new XVec2(0, 0);
    });

    test('更新后的位置应该为(0, -10)', () => {
        ply['velocity'] = new XVec2(0, -1);
        let result = new XVec2(0, -10);
        ply['updateSelfPosition']();

        expect(ply.node.x).toBeCloseTo(result.x);
        expect(ply.node.y).toBeCloseTo(result.y);
    });

    test('更新后的位置应该为(0, 10)', () => {
        ply['velocity'] = new XVec2(0, 1);
        let result = new XVec2(0, 10);
        ply['updateSelfPosition']();

        expect(ply.node.x).toBeCloseTo(result.x);
        expect(ply.node.y).toBeCloseTo(result.y);
    });
});