/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/timeline.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
var fixiGrid = (function () {
    function fixiGrid(options) {
        var _this = this;
        this.config = {
            width: 0,
            height: 0,
            timeLineWidth: 90
        };
        this.components = {
            header: null,
            timeLine: null,
            content: null
        };
        this.destroy = function () {
            $(window).off("resize.fixiGrid");
            _this.container.off("*");
            _this.container.empty();
        };
        this.container = $("#" + options.id);
        this.element = this.container.append(fixiGridTemplates.grid);
        this.d3svgheader = d3.select("#" + options.id + " .fixiGridHeader");
        this.d3svgcontent = d3.select("#" + options.id + " .fixiGridContent");
        this.components.header = new fixiGridComponents.fixiGridHeader({
            d3Container: this.d3svgheader.append("g").attr({ transform: "translate(" + (this.config.timeLineWidth) + "," + 30 + ")" }),
        });
        this.components.timeLine = new fixiGridComponents.timeLine({
            d3Container: this.d3svgcontent.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" }),
        });
        this.components.content = new fixiGridComponents.content({
            d3Container: this.d3svgcontent.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" }),
            scaleX: this.components.header.scale,
            scaleY: this.components.timeLine.scale
        });
        $(this.components.content).on("ongameclick", function (e, data, type) {
            if (type == "remove" && options.event && options.event.onRemove)
                options.event.onRemove(data, e);
            if (type == "edit" && options.event && options.event.onOpen)
                options.event.onOpen(data, e);
        });
        $(this.components.content).on("ongamechange", function (e, data, courtId, from, to) {
            if (options.event && options.event.onChange)
                options.event.onChange(data, courtId, from, to);
        });
        $(window).on("resize.fixiGrid", function () { _this.refreshSize(); });
    }
    fixiGrid.prototype.setData = function (args) {
        this.components.content.render(this.components.header.courts, args.games);
    };
    fixiGrid.prototype.setCourt = function (courts, from, to) {
        this.components.header.setCourts(courts);
        this.components.timeLine.setDate(from, to);
        this.refreshSize();
    };
    fixiGrid.prototype.refreshSize = function () {
        this.config.width = this.container.width() - 25;
        this.config.height = this.container.height();
        this.components.header.refreshSize(this.config.width, this.config.height);
        this.components.timeLine.refreshSize(this.config.width, this.config.height);
        this.components.content.reposition();
        this.d3svgcontent.attr({ height: this.components.timeLine.scale.range()[1] });
    };
    return fixiGrid;
})();
//# sourceMappingURL=fixiGrid.js.map