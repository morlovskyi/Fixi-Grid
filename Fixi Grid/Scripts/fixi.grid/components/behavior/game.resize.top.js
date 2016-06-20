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
                    var initialXY = d3.transform(this.target.attr("transform")).translate;
                    var initialGameHeight = parseInt(this.target.select(".game-aria").attr("height"));
                    var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);
                    var height = this.snapY(initialGameHeight + (initialXY[1] - top));
                    if (!this.isNewHeightValidByLimit(height))
                        return;
                    this.shadow.attr({
                        transform: "translate(" + initialXY[0] + "," + top + ")"
                    });
                    this.shadow.select(".game-aria").attr({
                        height: height
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