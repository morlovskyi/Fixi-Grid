/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameResizeDownBehavior extends BaseDragBehavior {
        private newGameHeight: number = null;

        protected shadowClass = "resize-shadow"
        protected drag(d: FixiCourtGame) {
            this.calculateNewHeight();

            if (this.newGameHeight < 0) return;
            if (!this.isNewHeightValidByLimit(this.newGameHeight)) return;

            this.gameAria.attr({
                height: this.newGameHeight
            })

            this.dragged = true;
        }
        private calculateNewHeight() {
            var point = (<any>event).pageY - this.dragStartPageY;
            var newDate = this.scaleY.invert(point);
            var axisRowValue = this.axisX.ticks()[1];
            newDate.setMinutes(newDate.getMinutes() - (newDate.getMinutes() % axisRowValue), 0)
            this.newGameHeight = this.gameAriaHeightOriginal + this.scaleY(newDate)
        }
    
    }
}