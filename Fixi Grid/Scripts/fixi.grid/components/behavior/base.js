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
                    this.availableCourts = [];
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
                Object.defineProperty(BaseDragBehavior.prototype, "targetRect", {
                    get: function () {
                        return {
                            left: this.snapY(d3.transform(this.target.attr("transform")).translate[0]),
                            top: this.snapY(d3.transform(this.target.attr("transform")).translate[1]),
                            width: parseFloat(this.target.select("rect.game-aria").attr("width")),
                            height: parseFloat(this.target.select("rect.game-aria").attr("height"))
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BaseDragBehavior.prototype, "dragResult", {
                    get: function () {
                        return {
                            left: this.snapY(d3.transform(this.shadow.attr("transform")).translate[0]),
                            top: this.snapY(d3.transform(this.shadow.attr("transform")).translate[1]),
                            width: parseFloat(this.shadow.select("rect.game-aria").attr("width")),
                            height: parseFloat(this.shadow.select("rect.game-aria").attr("height"))
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                BaseDragBehavior.prototype.dragStart = function (d) {
                    if (this.disabled)
                        return;
                    this.mouseMoveInfo = new Behaviors.MouseMoveInfo(event);
                    this.dragged = false;
                    var gElement = $(event.srcElement).parent().get(0);
                    var clone = $(gElement).clone();
                    this.availableCourts = [];
                    this.target = d3.select(gElement).classed(this.targetClass, true);
                    this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
                    this.shadow.attr({ "data-court-id": d.courtId });
                    clone.appendTo($(gElement).parent());
                    this.availableCourts = [];
                    var courtsDict = this.courtDict();
                    var type = courtsDict[d.courtId].type;
                    for (var id in courtsDict) {
                        if (courtsDict[id].type == type)
                            this.availableCourts.push(courtsDict[id]);
                    }
                    this.availableCourts.sort(function (a, b) {
                        if (a.position < b.position)
                            return -1;
                        if (a.position > b.position)
                            return 1;
                        return 0;
                    });
                };
                BaseDragBehavior.prototype.snapY = function (y) {
                    var startDate = new Date(this.scaleY.domain()[0].getTime());
                    var axisRowValue = this.axisX.ticks()[1];
                    startDate.setMinutes(startDate.getMinutes() + axisRowValue);
                    var width = this.scaleY(startDate);
                    return y - (y % width) + Math.round((y % width) / width) * width;
                };
                BaseDragBehavior.prototype.basedrag = function (d) {
                    if (this.disabled)
                        return;
                    this.mouseMoveInfo.move(event);
                    this.drag(d);
                    var court = this.getCourtInPoint(this.dragResult.left + 10, this.courtDict()[d.courtId].type);
                    this.shadow.classed("invalid", !this.validate(d, this.dragResult, court.id));
                };
                BaseDragBehavior.prototype.drag = function (d) {
                };
                BaseDragBehavior.prototype.dragEnd = function (d) {
                    if (this.disabled)
                        return;
                    var rect = this.dragResult;
                    var court = this.getCourtInPoint(rect.left + 10, this.courtDict()[d.courtId].type);
                    if (!this.dragged && rect.top == this.targetRect.top && this.targetRect.left == rect.left) {
                        $(this).trigger("edit", d);
                    }
                    else if (this.validate(d, rect, court.id)) {
                        d.courtId = court.id;
                        this.target.select(".game-aria").attr({
                            width: this.courtDict()[d.courtId].size,
                        });
                        this.target.attr({
                            transform: "translate(" + rect.left + "," + rect.top + ")",
                            height: rect.height
                        });
                        $(this).trigger("change", [rect, this.target, d]);
                    }
                    this.target.classed(this.targetClass, false);
                    this.shadow.remove();
                };
                BaseDragBehavior.prototype.isNewHeightValidByLimit = function (newHeight) {
                    var fromDate = this.scaleY.invert(newHeight);
                    var startDate = this.scaleY.domain()[0];
                    return parseInt(((fromDate.getTime() - startDate.getTime()) / 1000 / 60).toString()) >= this.minGameTimeRange;
                };
                BaseDragBehavior.prototype.validate = function (game, dragResult, courtId) {
                    if (this.isGamePositionValid)
                        return this.isGamePositionValid(game, dragResult, courtId);
                    return true;
                };
                BaseDragBehavior.prototype.getCourtInPoint = function (x, type) {
                    var courtsDict = this.courtDict();
                    var distance = 100000;
                    var result = null;
                    for (var id in courtsDict) {
                        var c = courtsDict[id];
                        if (c.position <= x && x < c.position + c.size) {
                            if (x - c.position < distance) {
                                result = c;
                                distance = x - c.position;
                            }
                            if (x - c.position == distance && c.type == type) {
                                result = c;
                            }
                        }
                    }
                    return result;
                    //return this.availableCourts.filter(c => {
                    //    return c.position <= x && x < c.position + c.size;
                    //})
                };
                return BaseDragBehavior;
            }());
            Behaviors.BaseDragBehavior = BaseDragBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=base.js.map