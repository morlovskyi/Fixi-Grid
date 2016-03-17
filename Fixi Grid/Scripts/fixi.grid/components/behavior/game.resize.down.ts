/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameResizeDownBehavior extends BaseDragBehavior {
        protected shadowClass = "resize-shadow"
        protected drag(d: FixiCourtGame) {
            var tempY = (<any>event).pageY - this.dragStartPageY;
            var y = this.scaleY.invert(tempY);
            var axisRowValue = this.axisX.ticks()[1];
            y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0)
            var top = this.scaleY(y)

            if (this.gameAriaHeightOriginal + top < 0) return;

            this.gameAria.attr({
                height: this.gameAriaHeightOriginal + top
            })
        }
    }
}