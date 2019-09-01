import { XNode, XComponent } from '../assets/script/ccengine';

export function createComponent<T extends XComponent>(type: { new(): T }): T {
    let node = new XNode('testNode');
    return node.addComponent(type);
}