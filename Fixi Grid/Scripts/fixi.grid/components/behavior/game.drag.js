var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var gameDragBehavior = (function (_super) {
            __extends(gameDragBehavior, _super);
            function gameDragBehavior() {
                _super.apply(this, arguments);
                this.targetClass = "dragged";
                this.shadowClass = "shadow";
            }
            gameDragBehavior.prototype.drag = function (d) {
                var tempX = event.pageX - this.dragStartPageX;
                var courtSize = this.courtDict()[d.courtId].size;
                var x = this.rect[0] + tempX + courtSize / 2;
                var left = x - x % courtSize;
                var tempY = event.pageY - this.dragStartPageY;
                var y = this.scaleY.invert(this.rect[1] + tempY);
                var axisRowValue = this.axisX.ticks()[1];
                y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                var top = this.scaleY(y);
                if (left < 0 || top < 0)
                    return;
                this.shadow.transition().duration(this.animatinoDuration).ease("sin-out").attr({
                    transform: "translate(" + left + "," + top + ")"
                });
            };
            return gameDragBehavior;
        })(behaviors.baseDragBehavior);
        behaviors.gameDragBehavior = gameDragBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
