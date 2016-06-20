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

            var changeCourt = this.getCourtInPoint((<MouseEvent>event).layerX - 45, court.type);

            var left = (changeCourt) ? changeCourt.position : shadowXY[0];  
            var width = (changeCourt) ? changeCourt.size : parseInt(this.shadow.select(".game-aria").attr("width"));
            var type = (changeCourt) ? changeCourt.type : court.type;
            var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);

            if (left < 0 || top < 0) return;
            this.shadow.attr({  
                transform: "translate(" + left + "," + top + ")"
            })

            if (court.type == type) {
                this.shadow.select(".game-aria").attr({
                    width: width
                })
                this.shadow.select(".title").attr({
                    x: width / 2
                })
                this.shadow.select(".description").attr({
                    transform: "translate(" + width / 2 + ",0)"
                })
            }
            this.dragged = true;
        }

    }
}