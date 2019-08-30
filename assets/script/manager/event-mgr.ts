/*
 * Description: 全局事件管理器
 * File: EventMgr.ts
 * Date: 2019-08-28 11:13:01
 * Author: midf
 */

export interface XEventCallback {
    listener: Function;
    context?: any;
}

export class EventMgr {
    private static events: Map<symbol, Array<XEventCallback>>;
    public static setup(): void {
        this.events = new Map<symbol, Array<XEventCallback>>();
    }

    public static clear(): void {
        this.events.clear();
    }

    public static has(eventType: symbol): boolean {
        return this.events.has(eventType);
    }

    public static on(eventType: symbol, listener: Function, context?: any): void {
        if (!this.has(eventType)) {
            this.events.set(eventType, []);
        }

        let event: XEventCallback = this.createCallback(listener, context);
        this.events.get(eventType).push(event);
    }

    public static off(eventType: symbol, listener: Function, context?: any): void {
        if (!this.has(eventType)) {
            return;
        }

        let callbacks: XEventCallback[] = this.getEventCallbacks(eventType);
        for (let i: number = callbacks.length - 1; i >= 0; i--) {
            let cb: XEventCallback = callbacks[i];
            if (cb.listener === listener && cb.context === context) {
                callbacks.splice(i, 1);
            }
        }
    }

    public static dispatch(eventType: symbol, ...args: any[]): void {
        if (!this.has(eventType)) {
            return;
        }

        let callbacks: XEventCallback[] = this.getEventCallbacks(eventType);
        callbacks.forEach((event: XEventCallback) => {
            event.listener.apply(event.context, args);
        });
    }

    private static createCallback(listener: Function, context?: any): XEventCallback {
        let callback: XEventCallback = {
            listener,
            context,
        };
        return callback;
    }

    private static getEventCallbacks(eventType: symbol): Array<XEventCallback> {
        if (!this.has(eventType)) {
            return [];
        }

        return this.events.get(eventType);
    }
}