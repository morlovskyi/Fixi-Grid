/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/timeline.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
/// <reference path="templates/print.html.ts" />
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
        this.print = function () {
            setTimeout(function () {
                var printerFrame = document.createElement('iframe'); // $("<iframe>")[0];
                var printView = $("<html>");
                printView.html(fixiGridTemplates.print);
                printView.find("#fixiGrid").append(_this.container.clone());
                $(window.document.body).append(printerFrame);
                printerFrame.contentWindow.document.writeln(printView.html());
                setTimeout(function () {
                    printerFrame.contentDocument.execCommand('print', false, null);
                    printerFrame.parentNode.removeChild(printerFrame);
                }, 250);
            }, 200);
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
        $(this.components.content).on("ongamechange", function (e, data, unitCell, from, to) {
            var court = _this.components.header.convertUnitCellToCourt(data, unitCell);
            if (options.event && options.event.onChange)
                options.event.onChange(data, court, from, to);
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
