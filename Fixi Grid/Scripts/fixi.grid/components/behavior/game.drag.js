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
                    var changeCourt = this.getCourtInPoint(event.layerX - 45, court.type);
                    var left = (changeCourt) ? changeCourt.position : shadowXY[0];
                    var width = (changeCourt) ? changeCourt.size : parseInt(this.shadow.select(".game-aria").attr("width"));
                    var type = (changeCourt) ? changeCourt.type : court.type;
                    var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);
                    if (left < 0 || top < 0)
                        return;
                    this.shadow.attr({
                        transform: "translate(" + left + "," + top + ")"
                    });
                    if (court.type == type) {
                        this.shadow.select(".game-aria").attr({
                            width: width
                        });
                        this.shadow.select(".title").attr({
                            x: width / 2
                        });
                        this.shadow.select(".description").attr({
                            transform: "translate(" + width / 2 + ",0)"
                        });
                    }
                    this.dragged = true;
                };
                return GameDragBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameDragBehavior = GameDragBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=game.drag.js.map