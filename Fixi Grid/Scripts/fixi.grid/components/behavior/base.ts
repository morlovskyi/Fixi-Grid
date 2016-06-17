﻿namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class BaseDragBehavior {
        public behavior: d3.behavior.Drag<FixiCourtGame>;
        protected target: d3.Selection<FixiCourtGame>;
        protected shadow: d3.Selection<FixiCourtGame>;
        protected rect: [number, number];
        protected animatinoDuration = 150;
        protected dragStartPageX: number;
        protected dragStartPageY: number;
        protected axisX: d3.svg.Axis;
        protected scaleY: d3.time.Scale<number, number>;
        protected courtDict: () => CourtMetrixDictionary;
        protected gameAria: d3.Selection<any>;
        protected gameAriaHeightOriginal: number;
        protected targetClass = "";
        protected shadowClass = "";
        protected dragged = false;
        protected availableCourts: CourtMetrix[] = [];
        public disabled = false;
        public minGameTimeRange = 15;
        public isGamePositionValid: (game: FixiCourtGame, rect: Rect) => boolean = null;

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

            this.dragged = false;
            var gElement = $(event.srcElement).parent().get(0);
            var clone = $(gElement).clone()
            this.availableCourts = [];
            this.target = d3.select(gElement).classed(this.targetClass, true);
            this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
            this.gameAria = this.shadow.select(".game-aria");
            this.gameAriaHeightOriginal = parseInt(this.gameAria.attr("height"));
            this.rect = d3.transform(this.shadow.attr("transform")).translate;
            this.shadow.attr({ "data-court-id": d.courtId })
            this.dragStartPageX = (<any>event).pageX
            this.dragStartPageY = (<any>event).pageY;
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

        private basedrag(d: FixiCourtGame) {
            if (this.disabled) return;

            this.drag(d);
            this.shadow.classed("invalid", !this.validate(d))
        }

        protected drag(d: FixiCourtGame) {

        }

        protected dragEnd(d: FixiCourtGame) {
            if (this.disabled) return;

            if (this.dragged == false) {
                this.resetShadow();

                $(this).trigger("edit", d)
            }
            else {
                if (!this.validate(d)) {
                    return this.resetShadow();
                };

                setTimeout(() => {
                    d.courtId = parseInt(this.shadow.attr("data-court-id"));

                    var rect = this.getRect();
                    this.target.select(".game-aria").attr({
                        width: this.courtDict()[d.courtId].size,
                    })
                    this.target.attr({
                        transform: "translate(" + rect.left + "," + rect.top + ")",
                        height: rect.height
                    })
                    this.resetShadow();

                    $(this).trigger("change", [this.getRect(), this.target, d])
                }, this.animatinoDuration)
            }
        }
        protected isNewHeightValidByLimit(newHeight: number) {
            var fromDate = this.scaleY.invert(newHeight);
            var startDate = this.scaleY.domain()[0];
            return parseInt(((fromDate.getTime() - startDate.getTime()) / 1000 / 60).toString()) >= this.minGameTimeRange;
        }

        private resetShadow() {
            this.target.classed(this.targetClass, false)
            this.shadow.remove();
        }
        public validate(game: FixiCourtGame) {
            if (this.isGamePositionValid)
                return this.isGamePositionValid(game, this.getRect())

            return true;
        }
        protected getRect(): Rect {
            var translate = d3.transform(this.shadow.attr("transform")).translate;
            var result = <Rect>{
                left: translate[0],
                top: translate[1],
                width: parseFloat(this.shadow.select("rect.game-aria").attr("width")),
                height: parseFloat(this.shadow.select("rect.game-aria").attr("height"))
            }
            return result
        }
    }
    export interface Rect {
        left: number,
        top: number,
        width: number,
        height: number
    }
}