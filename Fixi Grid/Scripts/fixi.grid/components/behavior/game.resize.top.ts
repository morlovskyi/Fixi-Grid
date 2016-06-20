/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameResizeTopBehavior extends BaseDragBehavior {
        protected shadowClass = "resize-shadow"
        protected drag(d: FixiCourtGame) {
            var initialXY = d3.transform(this.target.attr("transform")).translate;
            var initialGameHeight = parseInt(this.target.select(".game-aria").attr("height"));
            var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);
            var height = this.snapY(initialGameHeight + (initialXY[1] - top));

            if (!this.isNewHeightValidByLimit(height)) return;

            this.shadow.attr({
                transform: "translate(" + initialXY[0] + "," + top + ")"
            })

            this.shadow.select(".game-aria").attr({
                height: height
            })

            this.dragged = true;
        }
    }
}