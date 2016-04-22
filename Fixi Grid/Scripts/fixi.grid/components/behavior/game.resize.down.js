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
            var GameResizeDownBehavior = (function (_super) {
                __extends(GameResizeDownBehavior, _super);
                function GameResizeDownBehavior() {
                    _super.apply(this, arguments);
                    this.newGameHeight = null;
                    this.shadowClass = "resize-shadow";
                }
                GameResizeDownBehavior.prototype.drag = function (d) {
                    this.calculateNewHeight();
                    if (this.newGameHeight < 0)
                        return;
                    if (!this.isNewHeightValidByLimit(this.newGameHeight))
                        return;
                    this.gameAria.attr({
                        height: this.newGameHeight
                    });
                    this.dragged = true;
                };
                GameResizeDownBehavior.prototype.calculateNewHeight = function () {
                    var point = event.pageY - this.dragStartPageY;
                    var newDate = this.scaleY.invert(point);
                    var axisRowValue = this.axisX.ticks()[1];
                    newDate.setMinutes(newDate.getMinutes() - (newDate.getMinutes() % axisRowValue), 0);
                    this.newGameHeight = this.gameAriaHeightOriginal + this.scaleY(newDate);
                };
                return GameResizeDownBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameResizeDownBehavior = GameResizeDownBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=game.resize.down.js.map