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
            this.subscribe();
        }
        //#region public methods
        Grid.prototype.setData = function (args) {
            this.components.content.render(this.components.header.courts, args.games);
        };
        Grid.prototype.setCourt = function (courts, from, to) {
            this.components.header.setCourts(courts);
            this.components.timeLine.setDate(from, to);
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
            };
            this.components.onGameChangeHandler = function (e, args) {
                var court = _this.components.header.convertUnitCellToCourt(args.data, args.unitCell);
                if (_this.config.event && _this.config.event.onChange)
                    _this.config.event.onChange(args.data, court, args.from, args.to);
            };
            $(window).on("resize.fixiGrid", function () { _this.refreshSize(); });
        };
        Grid.prototype.refreshSize = function () {
            var newConfig = this.uiMarkup.refreshSizeConfiguration();
            this.components.header.refreshSize(newConfig);
            this.components.timeLine.refreshSize(newConfig);
            this.components.content.reposition();
            this.uiMarkup.d3ContentSelection.attr({ height: this.components.timeLine.scale.range()[1] });
        };
        return Grid;
    }());
    FixiGridUI.Grid = Grid;
})(FixiGridUI || (FixiGridUI = {}));
