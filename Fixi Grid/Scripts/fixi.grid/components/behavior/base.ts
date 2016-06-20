namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class BaseDragBehavior {
        public behavior: d3.behavior.Drag<FixiCourtGame>;
        public mouseMoveInfo: MouseMoveInfo;
        protected target: d3.Selection<FixiCourtGame>;
        protected shadow: d3.Selection<FixiCourtGame>;
        protected animatinoDuration = 150;
        protected axisX: d3.svg.Axis;
        protected scaleY: d3.time.Scale<number, number>;
        protected courtDict: () => CourtMetrixDictionary;
        protected targetClass = "";
        protected shadowClass = "";
        protected dragged = false;
        protected availableCourts: CourtMetrix[] = [];
        public disabled = false;
        public minGameTimeRange = 15;
        public isGamePositionValid: (game: FixiCourtGame, rect: Rect, courtId: number) => boolean = null;
        get targetRect(): Rect {
            return {
                left: this.snapY(d3.transform(this.target.attr("transform")).translate[0]),
                top: this.snapY(d3.transform(this.target.attr("transform")).translate[1]),
                width: parseFloat(this.target.select("rect.game-aria").attr("width")),
                height: parseFloat(this.target.select("rect.game-aria").attr("height"))
            }
        }
        get dragResult(): Rect {
            return {
                left: this.snapY(d3.transform(this.shadow.attr("transform")).translate[0]),
                top: this.snapY(d3.transform(this.shadow.attr("transform")).translate[1]),
                width: parseFloat(this.shadow.select("rect.game-aria").attr("width")),
                height: parseFloat(this.shadow.select("rect.game-aria").attr("height"))
            }
        }
        constructor(axisX: d3.svg.Axis, scaleY: d3.time.Scale<number, number>, courtDict: () => CourtMetrixDictionary) {
            this.axisX = axisX;
            this.scaleY = scaleY;
            this.courtDict = courtDict;
            this.behavior = d3.behavior.drag<FixiCourtGame>()
                .on("dragstart", this.dragStart.bind(this))
                .on("drag", this.basedrag.bind(this))
                .on("dragend", this.dragEnd.bind(this));
        }

        protected dragStart(d: FixiCourtGame) {
            if (this.disabled) return;
            this.mouseMoveInfo = new MouseMoveInfo(<MouseEvent>event);
            this.dragged = false;
            var gElement = $(event.srcElement).parent().get(0);
            var clone = $(gElement).clone()
            this.availableCourts = [];

            this.target = d3.select(gElement).classed(this.targetClass, true);
            this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
            this.shadow.attr({ "data-court-id": d.courtId })
            clone.appendTo($(gElement).parent());

            this.availableCourts = [];
            var courtsDict = this.courtDict();
            var type = courtsDict[d.courtId].type;
            for (var id in courtsDict) {
                if (courtsDict[id].type == type)
                    this.availableCourts.push(courtsDict[id])
            }
            this.availableCourts.sort((a, b) => {
                if (a.position < b.position)
                    return -1
                if (a.position > b.position)
                    return 1
                return 0
            })
        }
        public snapY(y: number) {
            var startDate = new Date(this.scaleY.domain()[0].getTime());
            var axisRowValue = this.axisX.ticks()[1];
            startDate.setMinutes(startDate.getMinutes() + axisRowValue);
            var width = this.scaleY(startDate);
            return y - (y % width) + Math.round((y % width) / width) * width;
        }
        private basedrag(d: FixiCourtGame) {
            if (this.disabled) return;
            this.mouseMoveInfo.move(<MouseEvent>event);
            this.drag(d);
            var court = this.getCourtInPoint(this.dragResult.left + 10, this.courtDict()[d.courtId].type);
            this.shadow.classed("invalid", !this.validate(d, this.dragResult, court.id))
        }

        protected drag(d: FixiCourtGame) {

        }

        protected dragEnd(d: FixiCourtGame) {
            if (this.disabled) return;
            var rect = this.dragResult;
            var court = this.getCourtInPoint(rect.left + 10, this.courtDict()[d.courtId].type);
            if (!this.dragged && rect.top == this.targetRect.top && this.targetRect.left == rect.left) {
                $(this).trigger("edit", d)
            }
            else if (this.validate(d, rect, court.id)) {    
                d.courtId = court.id;

                this.target.select(".game-aria").attr({
                    width: this.courtDict()[d.courtId].size,
                })
                this.target.attr({
                    transform: "translate(" + rect.left + "," + rect.top + ")",
                    height: rect.height
                })

                $(this).trigger("change", [rect, this.target, d])
            }
            this.target.classed(this.targetClass, false)
            this.shadow.remove();
        }

        protected isNewHeightValidByLimit(newHeight: number) {
            var fromDate = this.scaleY.invert(newHeight);
            var startDate = this.scaleY.domain()[0];
            return parseInt(((fromDate.getTime() - startDate.getTime()) / 1000 / 60).toString()) >= this.minGameTimeRange;
        }

        public validate(game: FixiCourtGame, dragResult: Rect, courtId: number) {
            if (this.isGamePositionValid)
                return this.isGamePositionValid(game, dragResult, courtId)

            return true;
        }

        public getCourtInPoint(x, type) {
            var courtsDict = this.courtDict();
            var distance = 100000;
            var result = null;
            for (var id in courtsDict) {
                var c = courtsDict[id];
                if (c.position <= x && x < c.position + c.size)
                {
                    if (x - c.position < distance)
                    {
                        result = c;
                        distance = x - c.position;
                    }
                    if (x - c.position == distance && c.type == type)
                    {
                        result = c;
                    }
                }
            }
            return result;
            //return this.availableCourts.filter(c => {
            //    return c.position <= x && x < c.position + c.size;
            //})
        }
    }
    export interface Rect {
        left: number,
        top: number,
        width: number,
        height: number
    }
}