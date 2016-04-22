var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var BaseDragBehavior = (function () {
                function BaseDragBehavior(axisX, scaleY, courtDict) {
                    this.animatinoDuration = 150;
                    this.targetClass = "";
                    this.shadowClass = "";
                    this.dragged = false;
                    this.disabled = false;
                    this.minGameTimeRange = 15;
                    this.isGamePositionValid = null;
                    this.axisX = axisX;
                    this.scaleY = scaleY;
                    this.courtDict = courtDict;
                    this.behavior = d3.behavior.drag()
                        .on("dragstart", this.dragStart.bind(this))
                        .on("drag", this.basedrag.bind(this))
                        .on("dragend", this.dragEnd.bind(this));
                }
                BaseDragBehavior.prototype.dragStart = function () {
                    if (this.disabled)
                        return;
                    this.dragged = false;
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
                BaseDragBehavior.prototype.basedrag = function (d) {
                    if (this.disabled)
                        return;
                    this.drag(d);
                    this.shadow.classed("invalid", !this.validate(d));
                };
                BaseDragBehavior.prototype.drag = function (d) {
                };
                BaseDragBehavior.prototype.dragEnd = function (d) {
                    var _this = this;
                    if (this.disabled)
                        return;
                    if (this.dragged == false) {
                        this.resetShadow();
                        $(this).trigger("edit", d);
                    }
                    else {
                        if (!this.validate(d)) {
                            return this.resetShadow();
                        }
                        ;
                        setTimeout(function () {
                            var rect = _this.getRect();
                            _this.target.attr({
                                transform: "translate(" + rect.left + "," + rect.top + ")",
                                height: rect.height
                            });
                            _this.resetShadow();
                            $(_this).trigger("change", [_this.getRect(), _this.target, d]);
                        }, this.animatinoDuration);
                    }
                };
                BaseDragBehavior.prototype.isNewHeightValidByLimit = function (newHeight) {
                    var fromDate = this.scaleY.invert(newHeight);
                    var startDate = this.scaleY.domain()[0];
                    return parseInt(((fromDate.getTime() - startDate.getTime()) / 1000 / 60).toString()) >= this.minGameTimeRange;
                };
                BaseDragBehavior.prototype.resetShadow = function () {
                    this.target.classed(this.targetClass, false);
                    this.shadow.remove();
                };
                BaseDragBehavior.prototype.validate = function (game) {
                    if (this.isGamePositionValid)
                        return this.isGamePositionValid(game, this.getRect());
                    return true;
                };
                BaseDragBehavior.prototype.getRect = function () {
                    var translate = d3.transform(this.shadow.attr("transform")).translate;
                    var result = {
                        left: translate[0],
                        top: translate[1],
                        width: parseFloat(this.shadow.select("rect.game-aria").attr("width")),
                        height: parseFloat(this.shadow.select("rect.game-aria").attr("height"))
                    };
                    return result;
                };
                return BaseDragBehavior;
            }());
            Behaviors.BaseDragBehavior = BaseDragBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=base.js.map