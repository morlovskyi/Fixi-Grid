/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameDragBehavior extends BaseDragBehavior {
        protected targetClass = "dragged";  
        protected shadowClass = "shadow"
        protected drag(d: FixiCourtGame) {
            var tempX = (<any>event).pageX - this.dragStartPageX;
            var courtSize = this.courtDict()[d.courtId].size;
            var x = this.rect[0] + tempX + courtSize / 2;
            var left = x - x % courtSize;


            var tempY = (<any>event).pageY - this.dragStartPageY;
            var y = this.scaleY.invert(this.rect[1] + tempY);
            var axisRowValue = this.axisX.ticks()[1];
            y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0)
            var top = this.scaleY(y)

            if (left < 0 || top < 0) return;
            this.shadow.transition().duration(this.animatinoDuration).ease("sin-out").attr({
                transform: "translate(" + left + "," + top + ")"
            })
        }

    }
}