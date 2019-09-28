import { XVec2, XEvent, XMouseEvent } from './../ccengine';
import { ccclass, XLoader, property, XScrollView, XNode, instantiate, XPrefab } from '../ccengine';
import { EXComponent } from '../common/interface/engine/ex-component';

interface MapItemConfig {
    name: string;
    x: number;
    y: number;
}

@ccclass
export class MapEditor extends EXComponent {
    @property(cc.Node)
    public scrollView: XNode = null;
    @property(cc.Node)
    public canvas: XNode = null;
    private viewContent: XScrollView;
    private map: Array<MapItemConfig>;

    public exportMapData(): void {
        console.log(this.map);
    }

    protected onLoad(): void {
        this.map = [];
        this.viewContent = this.scrollView.getComponent(cc.ScrollView);
        XLoader.loadResDir('prefab/map-item/', cc.Prefab, (error: Error, resource: XPrefab[], urls: string[]) => {
            this.loadMapItem(error, resource, urls);
        });
    }

    protected start(): void {

    }

    private loadMapItem(error: Error, resource: XPrefab[], urls: string[]): void {
        resource.forEach((res: XPrefab) => {
            let node: XNode = instantiate(res);
            node.on(XNode.EventType.MOUSE_DOWN, this.selectMapItem, this);
            node.position = XVec2.ZERO;
            this.viewContent.content.addChild(node);
        });
    }

    private selectMapItem(event: XMouseEvent): void {
        let target: XNode = event.target;
        let copy: XNode = instantiate(target);
        this.canvas.addChild(copy);
        copy.position = this.canvas.convertToNodeSpaceAR(event.getLocation());
        copy.on(XNode.EventType.MOUSE_MOVE, this.moveMapItem, this);
        copy.on(XNode.EventType.MOUSE_DOWN, this.putMapItem, this);
    }

    private moveMapItem(event: XMouseEvent): void {
        (event.target as XNode).position = this.canvas.convertToNodeSpaceAR(event.getLocation());
    }

    private putMapItem(event: XMouseEvent): void {
        let target: XNode = event.target;
        if (event.getButton() === XMouseEvent.BUTTON_RIGHT) {
            target.destroy();
            return;
        }

        let copy: XNode = instantiate(target);
        this.canvas.addChild(copy);
        copy.position = this.canvas.convertToNodeSpaceAR(event.getLocation());

        let name: string = target.name;
        let pos: XVec2 = event.getLocation();
        this.storedMapItemConf(name, pos.x, pos.y);
    }

    private storedMapItemConf(name: string, x: number, y: number): void {
        let itemConf: MapItemConfig = {
            name, x, y
        };
        this.map.push(itemConf);
    }
}