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
            var GameResizeTopBehavior = (function (_super) {
                __extends(GameResizeTopBehavior, _super);
                function GameResizeTopBehavior() {
                    _super.apply(this, arguments);
                    this.shadowClass = "resize-shadow";
                }
                GameResizeTopBehavior.prototype.drag = function (d) {
                    var tempY = event.pageY - this.dragStartPageY;
                    var y = this.scaleY.invert(this.rect[1] + tempY);
                    var axisRowValue = this.axisX.ticks()[1];
                    y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                    var top = this.scaleY(y);
                    if (top < 0 && this.rect[1] - top > 0)
                        return;
                    var newHeight = this.gameAriaHeightOriginal + (this.rect[1] - top);
                    if (!this.isNewHeightValidByLimit(newHeight))
                        return;
                    console.log(newHeight);
                    this.shadow.attr({
                        transform: "translate(" + this.rect[0] + "," + top + ")"
                    });
                    this.gameAria.attr({
                        height: newHeight
                    });
                    this.dragged = true;
                };
                return GameResizeTopBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameResizeTopBehavior = GameResizeTopBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=game.resize.top.js.map