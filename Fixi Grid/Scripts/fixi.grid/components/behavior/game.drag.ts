namespace fixiGridComponents.behaviors {
    export class gameDragBehavior {
        public behavior: d3.behavior.Drag<fixiCourtGame>;
        public target: d3.Selection<fixiCourtGame>;
        public shadow: d3.Selection<fixiCourtGame>;
        public rect: [number, number];
        public animatinoDuration = 150;

        private axisX: d3.svg.Axis;
        private scaleY: d3.time.Scale<number, number>;
        private courtDict: () => courtMetrixDictionary;
        constructor(axisX: d3.svg.Axis, scaleY: d3.time.Scale<number, number>, courtDict: () => courtMetrixDictionary) {
            this.axisX = axisX;
            this.scaleY = scaleY;
            this.courtDict = courtDict;
            this.behavior = d3.behavior.drag<fixiCourtGame>()
                .on("dragstart", this.dragStart.bind(this))
                .on("drag", this.drag.bind(this))
                .on("dragend", this.dragEnd.bind(this));
        }

        public dragStart() {
            var gElement = $(event.srcElement).parent().get(0);
            var clone = $(gElement).clone()

            this.target = d3.select(gElement).classed("dragged", true);
            this.shadow = d3.select(clone.get(0)).classed("shadow", true);

            this.rect = d3.transform(this.shadow.attr("transform")).translate;

            clone.appendTo($(gElement).parent());
        }
        public drag(d: fixiCourtGame) {

            //TODO: Fix issue on IE
            var event = <any>d3.event;

            var courtSize = this.courtDict()[d.courtId].size;
            var x = this.rect[0] + event.x;
            var left = x - x % courtSize;

            var y = this.scaleY.invert(this.rect[1] + event.y);
            var axisRowValue = this.axisX.ticks()[1];
            y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0)
            var top = this.scaleY(y)

            this.shadow.transition().duration(this.animatinoDuration).ease("sin-out").attr({
                transform: "translate(" + left + "," + top + ")"
            })
        }
        public dragEnd(d: fixiCourtGame) {
            setTimeout(() => {
              
                this.target.classed("dragged", false);
                this.shadow.remove();

                $(this).trigger("change", [d3.transform(this.shadow.attr("transform")).translate, this.target, d])
            }, this.animatinoDuration)
        }
    }
}