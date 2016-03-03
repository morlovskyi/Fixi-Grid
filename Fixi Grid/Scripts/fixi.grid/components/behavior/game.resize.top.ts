﻿/// <reference path="base.ts" />
namespace fixiGridComponents.behaviors {
    export class gameResizeTopBehavior extends baseDragBehavior {
        protected shadowClass = "resize-shadow"
        protected drag(d: fixiCourtGame) {
            var tempY = (<any>event).pageY - this.dragStartPageY;
            var y = this.scaleY.invert(this.rect[1] + tempY);
            var axisRowValue = this.axisX.ticks()[1];
            y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0)
            var top = this.scaleY(y)

            if (top < 0 && this.rect[1] - top > 0) return;

            this.shadow.attr({
                transform: "translate(" + this.rect[0] + "," + top + ")"
            })

            this.gameAria.attr({
                height: this.gameAriaHeightOriginal + (this.rect[1] - top)
            })
        }
    }
}