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

        protected dragStart() {
            this.dragged = false;
            var gElement = $(event.srcElement).parent().get(0);
            var clone = $(gElement).clone()

            this.target = d3.select(gElement).classed(this.targetClass, true);
            this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
            this.gameAria = this.shadow.select(".game-aria");
            this.gameAriaHeightOriginal = parseInt(this.gameAria.attr("height"));
            this.rect = d3.transform(this.shadow.attr("transform")).translate;

            this.dragStartPageX = (<any>event).pageX
            this.dragStartPageY = (<any>event).pageY;
            clone.appendTo($(gElement).parent());
        }

        private basedrag(d: FixiCourtGame) {
            this.drag(d);

            this.shadow.classed("invalid", !this.validate(d))
        }

        protected drag(d: FixiCourtGame) {

        }

        protected dragEnd(d: FixiCourtGame) {
            if (this.dragged == false) {
                this.resetShadow();

                $(this).trigger("edit", d)
            }
            else {
                if (!this.validate(d)) {
                    return this.resetShadow();
                };

                setTimeout(() => {
                    this.resetShadow();

                    $(this).trigger("change", [this.getRect(), this.target, d])
                }, this.animatinoDuration)
            }
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