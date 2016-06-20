/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameResizeDownBehavior extends BaseDragBehavior {
        private newGameHeight: number = null;

        protected shadowClass = "resize-shadow"
        protected drag(d: FixiCourtGame) {
            var initialXY = d3.transform(this.target.attr("transform")).translate;
            var initialGameHeight = parseInt(this.target.select(".game-aria").attr("height"));
            var height = this.snapY(initialGameHeight + this.mouseMoveInfo.offsetY);


            if (height < 0) return;

            if (!this.isNewHeightValidByLimit(height)) return;

            this.shadow.select(".game-aria").attr({
                height: height
            })

            this.dragged = true;
        }

    }
}