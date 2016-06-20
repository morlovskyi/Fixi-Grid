var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var MouseMoveInfo = (function () {
                function MouseMoveInfo(startEvent) {
                    var _this = this;
                    this.startEvent = startEvent;
                    this.pageX = 0;
                    this.pageY = 0;
                    this.movementX = 0;
                    this.movementY = 0;
                    this.moveEvent = null;
                    this.move = function (moveEvent) {
                        _this.moveEvent = moveEvent;
                        _this.movementX = _this.moveEvent.pageX - _this.pageX;
                        _this.movementY = _this.moveEvent.pageY - _this.pageY;
                        _this.pageX = _this.moveEvent.pageX;
                        _this.pageY = _this.moveEvent.pageY;
                    };
                    this.pageX = startEvent.pageX;
                    this.pageY = startEvent.pageY;
                }
                Object.defineProperty(MouseMoveInfo.prototype, "offsetX", {
                    get: function () {
                        if (!this.moveEvent)
                            return 0;
                        return this.moveEvent.pageX - this.startEvent.pageX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MouseMoveInfo.prototype, "offsetY", {
                    get: function () {
                        if (!this.moveEvent)
                            return 0;
                        return this.moveEvent.pageY - this.startEvent.pageY;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MouseMoveInfo;
            }());
            Behaviors.MouseMoveInfo = MouseMoveInfo;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=mouseMoveInfo.js.map