import { XNode, XComponent, XCollider } from '../assets/script/ccengine';

export function createComponent<T extends XComponent>(type: { new(): T }): T {
    let node = new XNode('testNode');
    return node.addComponent(type);
}

export function createCollider(): XCollider {
    let node = new XNode('colliderNode');
    return node.addComponent(XCollider);
}