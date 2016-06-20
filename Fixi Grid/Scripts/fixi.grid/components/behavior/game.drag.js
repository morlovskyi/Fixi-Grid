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
                    var court = this.courtDict()[id];
                    var shadowXY = d3.transform(this.shadow.attr("transform")).translate;
                    var initialXY = d3.transform(this.target.attr("transform")).translate;
                    var changeCourt = this.getCourtInPoint(event.layerX - 45)[0];
                    var left = (changeCourt) ? changeCourt.position : shadowXY[0];
                    var width = (changeCourt) ? changeCourt.size : this.shadow.select(".game-aria").attr("width");
                    var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);
                    if (left < 0 || top < 0)
                        return;
                    this.shadow.attr({
                        transform: "translate(" + left + "," + top + ")"
                    });
                    this.shadow.select(".game-aria").attr({
                        width: width
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