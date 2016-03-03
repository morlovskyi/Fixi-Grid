/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../models/court.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var fixiGridHeader = (function () {
        function fixiGridHeader(args) {
            var _this = this;
            this.fixiGridSize = {
                width: 0,
                height: 0
            };
            this.scale = d3.scale.linear();
            this.courtMetrikRegistry = {};
            this.render = function () {
                var courtHeaders = _this.countHeader.selectAll("g").data(_this.courts);
                courtHeaders.exit().remove();
                var courtTypes = courtHeaders.enter()
                    .append("g")
                    .classed("court-type", true);
                var court = courtTypes.selectAll(".court")
                    .data(function (d) { return d; });
                court.exit().remove();
                var countSection = court.enter().append("g")
                    .classed("court", true)
                    .attr({
                    "data-id": function (d) { return d.CourtId; },
                    "data-colspan": function (d) { return d.ColSpan; }
                });
                countSection.append("text")
                    .classed("court-title", true)
                    .attr({
                    dy: "-1em"
                })
                    .text(function (d) { return d.CourtName; });
                countSection.append("line")
                    .classed("court-line-1", true)
                    .attr({
                    stroke: "silver",
                    opacity: 0.2
                });
                countSection.append("line")
                    .classed("court-line-2", true)
                    .attr({
                    stroke: "black",
                    opacity: 0.125
                });
                countSection.append("line")
                    .classed("court-line-3", true)
                    .attr({
                    stroke: "black",
                    opacity: 0.125
                });
                _this.reposition();
            };
            this.options = args;
            this.countHeader = args.d3Container.append("g").classed("court-header", true);
        }
        Object.defineProperty(fixiGridHeader.prototype, "height", {
            get: function () { return this.courtLevelCount * 30; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(fixiGridHeader.prototype, "courtLevelCount", {
            get: function () { return this.courts.length; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(fixiGridHeader.prototype, "sectionWidth", {
            get: function () { return this.scale(1); },
            enumerable: true,
            configurable: true
        });
        fixiGridHeader.prototype.refreshSize = function (width, height) {
            this.fixiGridSize.width = width;
            this.fixiGridSize.height = width;
            this.scale.range([0, width - 90]);
            this.reposition();
        };
        fixiGridHeader.prototype.setCourts = function (courts) {
            var groupedByCelSize = fixiGridUtils.groupBy(courts, "ColSpan");
            var max = 0;
            var groupedByCelSizeArray = [];
            for (var i in groupedByCelSize) {
                max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length;
                groupedByCelSizeArray.push(groupedByCelSize[i]);
            }
            this.scale.domain([0, max]);
            this.courts = groupedByCelSizeArray;
            this.render();
        };
        fixiGridHeader.prototype.reposition = function () {
            var _this = this;
            var type = this.countHeader.selectAll(".court-type").attr({
                transform: function (d, i) { return "translate(0," + (30 * i) + ")"; }
            });
            var court = type.selectAll(".court");
            court.attr({
                transform: function (d, i) {
                    return "translate(" + _this.scale(d.ColSpan) * i + ",0)";
                }
            });
            court.selectAll(".court-title").attr({
                dx: function (d, i) { return _this.scale(d.ColSpan) / 2; }
            });
            court.selectAll(".court-line-2")
                .attr({
                x1: function (d, i, y) {
                    return _this.scale(d.ColSpan);
                },
                x2: function (d, i, y) {
                    return _this.scale(d.ColSpan);
                },
                y1: 0,
                y2: -30,
            });
            court.selectAll(".court-line-3")
                .attr({
                x1: 0,
                x2: function (d) { return _this.scale(d.ColSpan); },
                y1: 0,
                y2: 0
            });
        };
        fixiGridHeader.prototype.convertUnitCellToCourt = function (game, unitCell) {
            var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
            var requiredColSpanCourts = this.countHeader.selectAll("[data-colspan='" + currentGameCourt.ColSpan + "']").data();
            var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));
            return requiredColSpanCourts[requiredIndex];
        };
        return fixiGridHeader;
    })();
    fixiGridComponents.fixiGridHeader = fixiGridHeader;
})(fixiGridComponents || (fixiGridComponents = {}));
