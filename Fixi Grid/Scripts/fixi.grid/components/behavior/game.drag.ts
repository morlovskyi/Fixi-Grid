/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameDragBehavior extends BaseDragBehavior {
        protected targetClass = "dragged";
        protected shadowClass = "shadow"
        protected drag(d: FixiCourtGame) {
            var id = this.shadow.attr("data-court-id");
            var court = this.courtDict()[id];


            var shadowXY = d3.transform(this.shadow.attr("transform")).translate;
            var initialXY = d3.transform(this.target.attr("transform")).translate;
            
            var changeCourt = this.getCourtInPoint((<MouseEvent>event).layerX-45)[0];

            var left = (changeCourt) ? changeCourt.position : shadowXY[0];  
            var width = (changeCourt) ? changeCourt.size : this.shadow.select(".game-aria").attr("width");

            var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);

            if (left < 0 || top < 0) return;
            this.shadow.attr({  
                transform: "translate(" + left + "," + top + ")"
            })
            this.shadow.select(".game-aria").attr({
                width: width
            })
            this.dragged = true;
        }

    }
}