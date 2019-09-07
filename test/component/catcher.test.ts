
import { createComponent, createCollider } from '../utils';
import { Catcher, CatcherState, POSITION_ERROR } from '../../assets/script/component/catcher';
import { XVec2 } from '../../assets/script/ccengine';
import { MapItem } from '../../assets/script/component/map-item';
import { EventMgr } from '../../assets/script/manager/event-mgr';
import { XGameEvent } from '../../assets/script/define/event/game-event';

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

    EventMgr.setup();
});
afterEach(() => {
    catcher = null;
    EventMgr.clear();
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

describe('onCollisionEnter', () => {
    test('应该调用catchSomething和collect', () => {
        let ohter = createCollider();
        let self = createCollider();
        let catchSomething = spyOn<any>(catcher, 'catchSomething');
        let collect = spyOn<any>(catcher, 'collect');
        
        catcher.onCollisionEnter(ohter, self);
        expect(catchSomething).toHaveBeenCalledWith(ohter.node);
        expect(collect).toHaveBeenCalled();
    });
});

describe('updateState going', () => {
    test('state为going时，应该调用一次updateSelfPosition', () => {
        catcher['state'] = CatcherState.going;
        let updateSelfPosition = spyOn<any>(catcher, 'updateSelfPosition');
        
        catcher['updateState']();
        expect(updateSelfPosition).toHaveBeenCalledTimes(1);
    });
    test('state为going时，如果当前位置超过可移动的最大距离时应该调用一次back', () => {
        catcher['state'] = CatcherState.going;
        catcher.node.position = new XVec2(200, 300);
        let back = spyOn<any>(catcher, 'back');

        catcher['updateState']();
        expect(back).toHaveBeenCalledTimes(1);
    });
    test('state为going时，如果当前位置没有超过可移动的最大距离时不应该调用back', () => {
        catcher['state'] = CatcherState.going;
        let back = spyOn<any>(catcher, 'back');

        catcher['updateState']();
        expect(back).not.toHaveBeenCalled();
    });
});

describe('updateState backing', () => {
    test('state为backing时，应该调用一次updateSelfPosition', () => {
        catcher['state'] = CatcherState.backing;
        let renew = spyOn<any>(catcher, 'renew');   // 只为了替换renew函数的实现 没有其他作用
        let updateSelfPosition = spyOn<any>(catcher, 'updateSelfPosition');

        catcher['updateState']();
        expect(updateSelfPosition).toHaveBeenCalledTimes(1);
    });
    test('state为backing时，如果当前位置接近出发点时应该调用一次renew', () => {
        catcher['state'] = CatcherState.backing;
        catcher['originPos'] = new XVec2(0, 0);
        catcher.node.position = new XVec2(0 + POSITION_ERROR / 2, 0);
        let renew = spyOn<any>(catcher, 'renew');

        catcher['updateState']();
        expect(renew).toHaveBeenCalledTimes(1);
    });
    test('state为backing时，如果当前位置没有靠近出发点时不应该调用renew', () => {
        catcher['state'] = CatcherState.backing;
        catcher['originPos'] = new XVec2(0, 0);
        catcher.node.position = new XVec2(0 + POSITION_ERROR * 2, 0);
        let renew = spyOn<any>(catcher, 'renew');

        catcher['updateState']();
        expect(renew).not.toHaveBeenCalled();
    });
});

describe('updateState collecting', () => {
    test('state为collecting时，应该调用一次updateSelfPosition和一次updateTargetPosition', () => {
        catcher['state'] = CatcherState.collecting;
        let completeCollection = spyOn<any>(catcher, 'completeCollection');     // 同样只为了替换实现
        let updateSelfPosition = spyOn<any>(catcher, 'updateSelfPosition');
        let updateTargetPosition = spyOn<any>(catcher, 'updateTargetPosition');

        catcher['updateState']();
        expect(updateSelfPosition).toHaveBeenCalledTimes(1);
        expect(updateTargetPosition).toHaveBeenCalledTimes(1);
    });
    test('state为collecting时，如果当前位置接近出发点时应该调用一次completeCollection', () => {
        catcher['state'] = CatcherState.collecting;
        catcher['originPos'] = new XVec2(0, 0);
        catcher.node.position = new XVec2(0 + POSITION_ERROR / 2, 0);
        let completeCollection = spyOn<any>(catcher, 'completeCollection');

        catcher['updateState']();
        expect(completeCollection).toHaveBeenCalledTimes(1);
    });
    test('state为collecting时，如果当前位置没有靠近出发点时不应该调用completeCollection', () => {
        catcher['state'] = CatcherState.collecting;
        catcher['originPos'] = new XVec2(0, 0);
        catcher.node.position = new XVec2(0 + POSITION_ERROR * 2, 0);
        let completeCollection = spyOn<any>(catcher, 'completeCollection');

        catcher['updateState']();
        expect(completeCollection).not.toHaveBeenCalled();
    });
});

describe('catchSomething', () => {
    test('target应该为node上挂载的MapItem组件，并且应该调用该组件的beenCaught', () => {
        let mapItem: MapItem = createComponent(MapItem);
        let beenCaught = spyOn(mapItem, 'beenCaught');

        catcher['catchSomething'](mapItem.node);
        expect(catcher['target']).toEqual(mapItem);
        expect(beenCaught).toHaveBeenCalledTimes(1);
    });
});

describe('updateSelfPosition', () => {
    test('更新后的位置应该为(0, -10)', () => {
        catcher['velocity'] = new XVec2(0, -1);
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

describe('nearOriginPosition', () => {
    test('当前位置接近出发点时应该返回true', () => {
        catcher['originPos'] = new XVec2(0, 0);
        catcher.node.position = new XVec2(0, 0 + POSITION_ERROR / 2);

        expect(catcher['nearOriginPosition']()).toEqual(true);
    });
    test('当前位置没有接近出发点时应该返回false', () => {
        catcher['originPos'] = new XVec2(0, 0);
        catcher.node.position = new XVec2(0 + POSITION_ERROR * 2, 0);

        expect(catcher['nearOriginPosition']()).toEqual(false);
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

describe('changeState', () => {
    test('state应该与传入的state相同', () => {
        let result = CatcherState.going;
        catcher['state'] = CatcherState.backing;
        
        catcher['changeState'](result);
        expect(catcher['state']).toEqual(result);
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

describe('renew', () => {
    test('velocity应该等于XVec(0, 0)', () => {
        catcher['velocity'] = new XVec2(1, -1).normalize();

        catcher['renew']();
        expect(catcher['velocity']).toEqual(XVec2.ZERO);
    });
    test('应该调用changeState，传入参数为idle', () => {
        let changeState = spyOn<any>(catcher, 'changeState');

        catcher['renew']();
        expect(changeState).toHaveBeenCalledWith(CatcherState.idle);
    });
    test('应该派发PlyCompleted事件', () => {
        let dispatch = spyOn(EventMgr, 'dispatch');

        catcher['renew']();
        expect(dispatch).toHaveBeenCalledWith(XGameEvent.PlyCompleted);
    });
});

describe('collect', () => {
    test('velocity应该变为反方向', () => {
        let result = new XVec2(-1, 1);
        catcher['velocity'] = new XVec2(1, -1);

        catcher['collect']();
        expect(catcher['velocity']).toEqual(result);
    });
    test('应该调用changeState，传入参数为collecting', () => {
        let changeState = spyOn<any>(catcher, 'changeState');

        catcher['collect']();
        expect(changeState).toHaveBeenCalledWith(CatcherState.collecting);
    });
});

describe('completeCollection', () => {
    test('应该派发XGameEvent.CollectedMapItem事件', () => {
        let target = catcher['target'];
        let dispatch = spyOn(EventMgr, 'dispatch');

        catcher['completeCollection']();
        expect(dispatch).toHaveBeenCalledWith(XGameEvent.CollectedMapItem, target);
    });
    test('应该调用一次destroyMapItem', () => {
        let destroyMapItem = spyOn<any>(catcher, 'destroyMapItem');

        catcher['completeCollection']();
        expect(destroyMapItem).toHaveBeenCalledTimes(1);
    });
    test('应该调用一次renew', () => {
        let renew = spyOn<any>(catcher, 'renew');

        catcher['completeCollection']();
        expect(renew).toHaveBeenCalledTimes(1);
    });
});

describe('destroyMapItem', () => {
    test('应该调用target.node的destroy方法', () => {
        let destroy = spyOn(catcher['target'].node, 'destroy');

        catcher['destroyMapItem']();
        expect(destroy).toHaveBeenCalledTimes(1);
    });
    test('target应为为null', () => {
        catcher['destroyMapItem']();
        expect(catcher['target']).toBeNull();
    });
});