import { EventMgr, XEventCallback } from '../../assets/script/manager/event-mgr';

beforeEach(() => {
    EventMgr.setup();
});

afterEach(() => {
    EventMgr.clear();
});

describe('on', () => {
    test('注册新事件的回调时，事件集合中应该包含新事件', () => {
        let eventType = Symbol('test1');
        let func = () => { };
        EventMgr.on(eventType, func);
        expect(EventMgr.has(eventType)).toBe(true);
    });

    test('注册新事件的回调时，新事件的回调数据列表中应该包含新的回调数据', () => {
        let eventType = Symbol('test1');
        let func = () => {};
        EventMgr.on(eventType, func);

        let event: XEventCallback = EventMgr['createCallback'](func);
        let list = EventMgr['getEventCallbacks'](eventType);
        expect(list).toContainEqual(event);
    });

    test('注册事件的回调时，事件的回调数据列表中应该包含回调数据', () => {
        let eventType = Symbol('test1');
        let func = () => { };
        EventMgr.on(eventType, func);

        EventMgr.on(eventType, func);

        let event: XEventCallback = EventMgr['createCallback'](func);
        let list = EventMgr['getEventCallbacks'](eventType);
        expect(list).toContainEqual(event);
    });
});

describe('dispatch', () => {
    test('事件的回调函数应该被调用一次', () => {
        let eventType = Symbol('test1');
        let callbackFun = jest.fn();
        EventMgr.on(eventType, callbackFun);

        EventMgr.dispatch(eventType);
        expect(callbackFun).toBeCalledTimes(1);
    });

    test('事件的所有回调函数都应该被调用一次', () => {
        let eventType = Symbol('test1');
        let callbackFun1 = jest.fn();
        let callbackFun2 = jest.fn();
        let callbackFun3 = jest.fn();
        EventMgr.on(eventType, callbackFun1);
        EventMgr.on(eventType, callbackFun2);
        EventMgr.on(eventType, callbackFun3);

        EventMgr.dispatch(eventType);
        expect(callbackFun1).toBeCalledTimes(1);
        expect(callbackFun2).toBeCalledTimes(1);
        expect(callbackFun3).toBeCalledTimes(1);
    });

    test('注册事件没有传递context参数时，事件回调函数中this应该为undefined', (done) => {
        let eventType = Symbol('test1');
        function callbackFun() {
            expect(this).toBeUndefined();
            done();
        }
        EventMgr.on(eventType, callbackFun);
        EventMgr.dispatch(eventType);
    });

    test('事件回调函数中的this对象应该和注册时传递的context参数一致', (done) => {
        let eventType = Symbol('test1');
        let context = {
            whatever: 999,
        };
        function callbackFun() {
            expect(this).toEqual(context);
            done();
        }
        EventMgr.on(eventType, callbackFun, context);
        EventMgr.dispatch(eventType);
    });

    test('事件回调函数的参数列表应该和分发事件时传递的参数列表一致', (done) => {
        let eventType = Symbol('test1');
        let callbackFun = jest.fn(() => {
            done();
        });
        EventMgr.on(eventType, callbackFun);

        EventMgr.dispatch(eventType, 1, 'a', false, {});
        expect(callbackFun).toBeCalledWith(1, 'a', false, {});
    });

    test('注销事件的特定回调后，该回调函数应该不会被调用', () => {
        let eventType = Symbol('test1');
        let callbackFun = jest.fn();
        EventMgr.on(eventType, callbackFun);

        EventMgr.off(eventType, callbackFun);
        EventMgr.dispatch(eventType);
        expect(callbackFun).not.toBeCalled();
    });
});