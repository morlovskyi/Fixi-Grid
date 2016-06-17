/// <reference path="base.ts" />
namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class GameDragBehavior extends BaseDragBehavior {
        protected targetClass = "dragged";
        protected shadowClass = "shadow"
        protected drag(d: FixiCourtGame) {
            var id = this.shadow.attr("data-court-id");
            var tempX = (<any>event).pageX - this.dragStartPageX;
            var d3event = <any>d3.event;
            var courtSize = this.courtDict()[id].size;
            var courtPosition = this.courtDict()[id].position;
            var newCourt = null;
            this.availableCourts.forEach((x, i, array) => {
                var tempCourt;
                if (x.id == <any>id) {
                    if (d3event.x < courtSize) {
                        tempCourt = array[i - 1]
                    }
                    else {
                        tempCourt = array[i + 1]
                    }
                }
                if (!tempCourt || tempCourt.position == courtPosition) return;

                newCourt = tempCourt;
            })
            var left;
            if (!newCourt) {
                left = d3.transform(this.shadow.attr("transform")).translate[0]
            } else {
                left = newCourt.position;
                this.shadow.attr({
                    "data-court-id": newCourt.id
                })

                this.shadow.select(".game-aria").attr({
                    width: newCourt.size,
                })
            }
            var tempY = (<any>event).pageY - this.dragStartPageY;
            var y = this.scaleY.invert(this.rect[1] + tempY);
            var axisRowValue = this.axisX.ticks()[1];
            y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0)
            var top = this.scaleY(y)

            if (left < 0 || top < 0) return;

            this.shadow.attr({
                transform: "translate(" + left + "," + top + ")"
            })
         
            this.dragged = true;
        }

    }
}