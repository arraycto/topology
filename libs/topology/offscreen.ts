import { Node } from './models/node';
import { Line } from './models/line';
import { Store } from 'le5le-store';
import { Options } from './options';
import { Canvas } from './canvas';

export class Offscreen extends Canvas {
  private nodes: Node[] = Store.get('nodes');
  private lines: Line[] = Store.get('lines');
  constructor(public parentElem: HTMLElement, public options: Options = {}) {
    super(parentElem, options);
    this.canvas.style.left = '-10000px';
    this.canvas.style.top = '-10000px';
    Store.set('offscreen', this.canvas);
    this.init();
  }

  init() {
    this.nodes = Store.get('nodes');
    this.lines = Store.get('lines');
  }

  resize(size?: { width: number; height: number }) {
    super.resize(size);

    this.canvas.width = this.width * this.dpiRatio;
    this.canvas.height = this.height * this.dpiRatio;
    this.canvas.getContext('2d').scale(this.dpiRatio, this.dpiRatio);
  }

  render() {
    super.render();

    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = this.options.color;

    this.renderNodes();
    this.renderLines();
    Store.set('render', 1);
  }

  renderNodes() {
    if (!this.nodes.length) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    for (const item of this.nodes) {
      if (item.animateStart && item.animateDuration) {
        continue;
      }
      item.render(ctx);
    }
  }

  renderLines() {
    if (!this.lines.length) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    let i = 0;
    for (const item of this.lines) {
      if (!item.to) {
        this.lines.splice(i++, 1);
        continue;
      }
      item.render(ctx);
      ++i;
    }
  }
}
