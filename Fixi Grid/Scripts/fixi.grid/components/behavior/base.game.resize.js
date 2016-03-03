var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var baseResizeBehavior = (function () {
            function baseResizeBehavior(axisX, scaleY, courtDict) {
                this.animatinoDuration = 150;
                this.targetClass = "";
                this.shadowClass = "";
                this.axisX = axisX;
                this.scaleY = scaleY;
                this.courtDict = courtDict;
                this.behavior = d3.behavior.drag()
                    .on("dragstart", this.dragStart.bind(this))
                    .on("drag", this.drag.bind(this))
                    .on("dragend", this.dragEnd.bind(this));
            }
            baseResizeBehavior.prototype.dragStart = function () {
                var gElement = $(event.srcElement).parent().get(0);
                var clone = $(gElement).clone();
                this.target = d3.select(gElement).classed(this.targetClass, true);
                this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
                this.gameAria = this.shadow.select(".game-aria");
                this.gameAriaHeightOriginal = parseInt(this.gameAria.attr("height"));
                this.rect = d3.transform(this.shadow.attr("transform")).translate;
                this.dragStartPageX = event.pageX;
                this.dragStartPageY = event.pageY;
                clone.appendTo($(gElement).parent());
            };
            baseResizeBehavior.prototype.drag = function (d) {
            };
            baseResizeBehavior.prototype.dragEnd = function (d) {
                var _this = this;
                setTimeout(function () {
                    _this.target.classed(_this.targetClass, false);
                    _this.shadow.remove();
                    var translate = d3.transform(_this.shadow.attr("transform")).translate;
                    var result = {
                        left: translate[0],
                        top: translate[1],
                        width: parseFloat(_this.shadow.select("rect.game-aria").attr("width")),
                        height: parseFloat(_this.shadow.select("rect.game-aria").attr("height"))
                    };
                    $(_this).trigger("change", [result, _this.target, d]);
                }, this.animatinoDuration);
            };
            return baseResizeBehavior;
        })();
        behaviors.baseResizeBehavior = baseResizeBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
