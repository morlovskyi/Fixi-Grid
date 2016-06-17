var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var GameDragBehavior = (function (_super) {
                __extends(GameDragBehavior, _super);
                function GameDragBehavior() {
                    _super.apply(this, arguments);
                    this.targetClass = "dragged";
                    this.shadowClass = "shadow";
                }
                GameDragBehavior.prototype.drag = function (d) {
                    var id = this.shadow.attr("data-court-id");
                    var tempX = event.pageX - this.dragStartPageX;
                    var d3event = d3.event;
                    var courtSize = this.courtDict()[id].size;
                    var courtPosition = this.courtDict()[id].position;
                    var newCourt = null;
                    this.availableCourts.forEach(function (x, i, array) {
                        var tempCourt;
                        if (x.id == id) {
                            if (d3event.x < courtSize) {
                                tempCourt = array[i - 1];
                            }
                            else {
                                tempCourt = array[i + 1];
                            }
                        }
                        if (!tempCourt || tempCourt.position == courtPosition)
                            return;
                        newCourt = tempCourt;
                    });
                    var left;
                    if (!newCourt) {
                        left = d3.transform(this.shadow.attr("transform")).translate[0];
                    }
                    else {
                        left = newCourt.position;
                        this.shadow.attr({
                            "data-court-id": newCourt.id
                        });
                        this.shadow.select(".game-aria").attr({
                            width: newCourt.size,
                        });
                    }
                    var tempY = event.pageY - this.dragStartPageY;
                    var y = this.scaleY.invert(this.rect[1] + tempY);
                    var axisRowValue = this.axisX.ticks()[1];
                    y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                    var top = this.scaleY(y);
                    if (left < 0 || top < 0)
                        return;
                    this.shadow.attr({
                        transform: "translate(" + left + "," + top + ")"
                    });
                    this.dragged = true;
                };
                return GameDragBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameDragBehavior = GameDragBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=game.drag.js.map