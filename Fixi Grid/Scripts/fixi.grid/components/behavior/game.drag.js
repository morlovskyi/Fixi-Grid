var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var gameDragBehavior = (function () {
            function gameDragBehavior(axisX, scaleY, courtDict) {
                this.animatinoDuration = 150;
                this.axisX = axisX;
                this.scaleY = scaleY;
                this.courtDict = courtDict;
                this.behavior = d3.behavior.drag()
                    .on("dragstart", this.dragStart.bind(this))
                    .on("drag", this.drag.bind(this))
                    .on("dragend", this.dragEnd.bind(this));
            }
            gameDragBehavior.prototype.dragStart = function () {
                var gElement = $(event.srcElement).parent().get(0);
                var clone = $(gElement).clone();
                this.target = d3.select(gElement).classed("dragged", true);
                this.shadow = d3.select(clone.get(0)).classed("shadow", true);
                this.rect = d3.transform(this.shadow.attr("transform")).translate;
                clone.appendTo($(gElement).parent());
            };
            gameDragBehavior.prototype.drag = function (d) {
                //TODO: Fix issue on IE
                var event = d3.event;
                var courtSize = this.courtDict()[d.courtId].size;
                var x = this.rect[0] + event.x;
                var left = x - x % courtSize;
                var y = this.scaleY.invert(this.rect[1] + event.y);
                var axisRowValue = this.axisX.ticks()[1];
                y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                var top = this.scaleY(y);
                this.shadow.transition().duration(this.animatinoDuration).ease("sin-out").attr({
                    transform: "translate(" + left + "," + top + ")"
                });
            };
            gameDragBehavior.prototype.dragEnd = function (d) {
                var _this = this;
                setTimeout(function () {
                    _this.target.classed("dragged", false);
                    _this.shadow.remove();
                    $(_this).trigger("change", [d3.transform(_this.shadow.attr("transform")).translate, _this.target, d]);
                }, this.animatinoDuration);
            };
            return gameDragBehavior;
        })();
        behaviors.gameDragBehavior = gameDragBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
//# sourceMappingURL=game.drag.js.map