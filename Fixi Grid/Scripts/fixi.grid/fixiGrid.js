/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/TimeLine.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
/// <reference path="templates/print.html.ts" />
/// <reference path="models/components.ts" />
/// <reference path="models/printer.ts" />
/// <reference path="models/uimarkup.ts" />
var FixiGridUI;
(function (FixiGridUI) {
    var Grid = (function () {
        function Grid(config) {
            var _this = this;
            this.config = config;
            this.destroy = function () {
                $(window).off("resize.fixiGrid");
                _this.uiMarkup.dispose();
            };
            this.uiMarkup = new FixiGridUI.Models.UIMarkup(config.id);
            this.printer = new FixiGridUI.Models.Printer(this.uiMarkup);
            this.components = new FixiGridUI.Models.Components(this.uiMarkup);
            this.setGameMinTimeRange = config.minGameTimnRange;
            this.resizable = !!config.resizable;
            this.draggable = !!config.draggable;
            this.subscribe();
        }
        Object.defineProperty(Grid.prototype, "draggable", {
            set: function (value) {
                this.components.content.gameDragBehavior.disabled = !value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "resizable", {
            set: function (value) {
                this.components.content.gameResizeDownBehavior.disabled = !value;
                this.components.content.gameResizeTopBehavior.disabled = !value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "setGameMinTimeRange", {
            set: function (value) {
                this.components.content.setGameMinTimeRange(value);
            },
            enumerable: true,
            configurable: true
        });
        //#region public methods
        Grid.prototype.setData = function (games) {
            this.components.content.render(this.components.header.courts, games);
        };
        Grid.prototype.getData = function () {
            return this.components.content.games;
        };
        Grid.prototype.setCourt = function (courts) {
            this.components.header.setCourts(courts);
            this.refreshSize();
        };
        Grid.prototype.setTimeRange = function (args) {
            this.components.timeLine.setDate(args.from, args.to);
            this.refreshSize();
        };
        //#endregion
        //#region private methods
        Grid.prototype.subscribe = function () {
            var _this = this;
            this.components.onGameClickHandler = function (e, args) {
                switch (args.type) {
                    case "remove":
                        if (_this.config.event && _this.config.event.onRemove)
                            _this.config.event.onRemove(args.data, e);
                        break;
                    case "edit":
                        if (_this.config.event && _this.config.event.onOpen)
                            _this.config.event.onOpen(args.data, e);
                        break;
                    default:
                        break;
                }
                _this.refresh();
            };
            this.components.onGameChangeHandler = function (e, args) {
                //var court: FixiGridComponents.FixiCourtDB = this.components.header.convertUnitCellToCourt(args.data, args.unitCell);
                var promiseChange = null;
                if (_this.config.event && _this.config.event.onChange)
                    promiseChange = _this.config.event.onChange(args.data, _this.components.header.originalCourts.filter(function (x) { return x.CourtId == args.courtId; })[0], args.from, args.to);
                if (promiseChange)
                    promiseChange.then(function () {
                        _this.refresh();
                    });
                else
                    _this.refresh();
            };
            $(window).on("resize.fixiGrid", function () { _this.refreshSize(); });
        };
        Grid.prototype.refresh = function () {
            this.components.content.render(this.components.header.courts, this.getData());
            this.refreshSize();
        };
        Grid.prototype.refreshSize = function () {
            var newConfig = this.uiMarkup.refreshSizeConfiguration();
            this.components.header.refreshSize(newConfig);
            this.components.timeLine.refreshSize(newConfig);
            this.components.content.reposition();
            this.uiMarkup.d3ContentSelection.attr({ height: this.components.timeLine.scale.range()[1] });
        };
        Grid.prototype.print = function () {
            this.printer.print(this.components.content.games, this.components.header.originalCourts, this.components.timeLine.from, this.components.timeLine.to);
        };
        return Grid;
    }());
    FixiGridUI.Grid = Grid;
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=fixiGrid.js.map