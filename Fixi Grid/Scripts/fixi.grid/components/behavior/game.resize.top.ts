/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameResizeTopBehavior extends BaseDragBehavior {
        protected shadowClass = "resize-shadow"
        protected drag(d: FixiCourtGame) {
            var tempY = (<any>event).pageY - this.dragStartPageY;
            var y = this.scaleY.invert(this.rect[1] + tempY);
            var axisRowValue = this.axisX.ticks()[1];
            y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0)
            var top = this.scaleY(y)

            if (top < 0 && this.rect[1] - top > 0) return;

            var newHeight = this.gameAriaHeightOriginal + (this.rect[1] - top);

            if (!this.isNewHeightValidByLimit(newHeight)) return;
            console.log(newHeight)
            this.shadow.attr({
                transform: "translate(" + this.rect[0] + "," + top + ")"
            })

            
            this.gameAria.attr({
                height: newHeight
            })

            this.dragged = true;
        }
    }
}