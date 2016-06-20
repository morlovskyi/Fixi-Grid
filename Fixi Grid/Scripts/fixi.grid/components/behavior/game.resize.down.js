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
                    var initialXY = d3.transform(this.target.attr("transform")).translate;
                    var initialGameHeight = parseInt(this.target.select(".game-aria").attr("height"));
                    var height = this.snapY(initialGameHeight + this.mouseMoveInfo.offsetY);
                    if (height < 0)
                        return;
                    if (!this.isNewHeightValidByLimit(height))
                        return;
                    this.shadow.select(".game-aria").attr({
                        height: height
                    });
                    this.dragged = true;
                };
                return GameResizeDownBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameResizeDownBehavior = GameResizeDownBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=game.resize.down.js.map