
import { createComponent } from '../utils';
import { Catcher, CatcherState } from '../../assets/script/component/catcher';
import { XVec2 } from '../../assets/script/ccengine';
import { MapItem } from '../../assets/script/component/map-item';

let catcher: Catcher = null;
beforeEach(() => {
    catcher = createComponent(Catcher);
    catcher['originPos'] = new XVec2(0, 0);
    catcher.speed = 10;
    catcher.maxDistance = 200;
    catcher.node.position = new XVec2(0, 0);
    catcher['target'] = createComponent(MapItem);
    catcher['target'].weight = 1;
    catcher['target'].node.position = new XVec2(0, 0);
});
afterEach(() => {
    catcher = null;
});

describe('getSpeed', () => {
    test('没有抓取到目标时，返回值应该与speed相同', () => {
        catcher['target'] = null;
        let result = catcher.speed;
        expect(catcher.getSpeed()).toEqual(result);
    });
    test('抓取到目标时，返回值应该与(speed / target.weight)相同', () => {
        let weight = 2;
        catcher['target'].weight = weight;
        let result = catcher.speed / weight;
        expect(catcher.getSpeed()).toEqual(result);
    });
});

describe('go', () => {
    test('角度为45时，速度应该近似等于Vec(1, -1).normalize()，state应该为going', () => {
        catcher.node.angle = 45;
        let result = new XVec2(1, -1).normalize();

        catcher['go']();
        expect(catcher['velocity'].x).toBeCloseTo(result.x);
        expect(catcher['velocity'].y).toBeCloseTo(result.y);
        expect(catcher['state']).toEqual(CatcherState.going);
    });

    test('角度为-45时，速度应该近似等于Vec(-1, -1).normalize()，state应该为going', () => {
        catcher.node.angle = -45;
        let result = new XVec2(-1, -1).normalize();

        catcher['go']();
        expect(catcher['velocity'].x).toBeCloseTo(result.x);
        expect(catcher['velocity'].y).toBeCloseTo(result.y);
        expect(catcher['state']).toEqual(CatcherState.going);
    });

    test('如果当前速度不为Vec(0, 0)，不应该改变原来的速度，state不应该改变', () => {
        catcher.node.angle = 23;
        let origin = new XVec2(1, -1).normalize();
        catcher['velocity'] = origin.clone();
        let originState = catcher['state'];

        catcher['go']();
        expect(catcher['velocity'].x).toBeCloseTo(origin.x);
        expect(catcher['velocity'].y).toBeCloseTo(origin.y);
        expect(catcher['state']).toEqual(originState);
    });
});

describe('back', () => {
    test('速度应该变为反方向， state应该为backing', () => {
        let result = new XVec2(-1, 1).normalize();
        catcher['velocity'] = new XVec2(1, -1).normalize();

        catcher['back']();
        expect(catcher['velocity'].x).toBeCloseTo(result.x);
        expect(catcher['velocity'].y).toBeCloseTo(result.y);
        expect(catcher['state']).toEqual(CatcherState.backing);
    });
});

describe('exceedMaxDistance', () => {
    test('当前位置超过可移动的最大距离时应该返回true', () => {
        catcher.node.position = new XVec2(200, 300);
        catcher.maxDistance = 200;

        expect(catcher['exceedMaxDistance']()).toEqual(true);
    });

    test('当前位置不超过可移动的最大距离时应该返回false', () => {
        catcher.node.position = new XVec2(50, 50);
        catcher.maxDistance = 200;

        expect(catcher['exceedMaxDistance']()).toEqual(false);
    });
});

describe('updateSelfPosition', () => {
    test('更新后的位置应该为(0, -10)', () => {
        catcher['velocity'] = new XVec2(0, -1);
        console.log(catcher.speed);
        let result = new XVec2(0, -10);
        catcher['updateSelfPosition']();

        expect(catcher.node.x).toBeCloseTo(result.x);
        expect(catcher.node.y).toBeCloseTo(result.y);
    });

    test('更新后的位置应该为(0, 10)', () => {
        catcher['velocity'] = new XVec2(0, 1);
        let result = new XVec2(0, 10);
        catcher['updateSelfPosition']();

        expect(catcher.node.x).toBeCloseTo(result.x);
        expect(catcher.node.y).toBeCloseTo(result.y);
    });
});

describe('updateTargetPosition', () => {
    test('更新后target的位置应该为(0, -10)', () => {
        catcher['velocity'] = new XVec2(0, -1);
        let result = new XVec2(0, -10);
        catcher['updateTargetPosition']();

        expect(catcher['target'].node.x).toBeCloseTo(result.x);
        expect(catcher['target'].node.y).toBeCloseTo(result.y);
    });

    test('更新后target的位置应该为(0, 10)', () => {
        catcher['velocity'] = new XVec2(0, 1);
        let result = new XVec2(0, 10);
        catcher['updateTargetPosition']();

        expect(catcher['target'].node.x).toBeCloseTo(result.x);
        expect(catcher['target'].node.y).toBeCloseTo(result.y);
    });
});