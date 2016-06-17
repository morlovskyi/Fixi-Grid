/// <reference path="../../typings/d3/d3.d.ts" />
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var FixiGridHeader = (function () {
            function FixiGridHeader(args) {
                var _this = this;
                this.fixiGridSize = {
                    width: 0,
                    height: 0
                };
                this.scale = d3.scale.linear();
                this.courtMetrikRegistry = {};
                this.render = function () {
                    var courtHeaders = _this.countHeader.selectAll("tr").data(_this.headerData);
                    courtHeaders.exit().remove();
                    var courtTypes = courtHeaders.enter()
                        .append("tr")
                        .classed("court-type", true);
                    var court = courtTypes.selectAll("th")
                        .data(function (d) { return d; });
                    court.exit().remove();
                    var countSection = court.enter().append("th")
                        .classed("court", true)
                        .attr({
                        "data-id": function (d) { return d.CourtId; },
                        "colspan": function (d) { return d.ColSpan; },
                        "rowspan": function (d) { return d.RowSpan; },
                        "type": function (d) { return d.Type; }
                    }).text(function (d) { return d.CourtName; });
                };
                this.options = args;
                this.countHeader = args.d3Container.classed("court-header", true);
            }
            Object.defineProperty(FixiGridHeader.prototype, "height", {
                get: function () { return this.courtLevelCount * 30; },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(FixiGridHeader.prototype, "courtLevelCount", {
                get: function () { return this.courts.length; },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(FixiGridHeader.prototype, "sectionWidth", {
                get: function () { return this.scale(1); },
                enumerable: true,
                configurable: true
            });
            FixiGridHeader.prototype.refreshSize = function (config) {
                this.fixiGridSize.width = config.headerWidth;
                this.fixiGridSize.height = config.height;
                this.scale.range([0, config.headerWidth]);
                //this.reposition();
            };
            FixiGridHeader.prototype.setCourts = function (courts) {
                this.originalCourts = courts;
                var groupedByCelSize = FixiGridUI.Utils.groupBy(courts, "ColSpan");
                var max = 0;
                var min = 1000;
                var groupedByCelSizeArray = [];
                for (var i in groupedByCelSize) {
                    max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length;
                    groupedByCelSizeArray.push(groupedByCelSize[i]);
                    min = (min > parseInt(i)) ? parseInt(i) : min;
                }
                this.scale.domain([0, max]);
                var header = [];
                header.push(this.originalCourts.filter(function (c) { return c.ColSpan == min; }).sort(function (a, b) {
                    if (a.ParentCourtId < b.ParentCourtId)
                        return -1;
                    if (a.ParentCourtId > b.ParentCourtId)
                        return 1;
                    return 0;
                }));
                var length = header[0].length;
                var index = 0;
                var stopper = 0;
                while (length != courts.length || stopper > 10) {
                    var nextLevel = this.originalCourts.filter(function (c) {
                        var isParent;
                        isParent = header[index].filter(function (child) { return child.ParentCourtId == c.CourtId; }).length > 0;
                        return isParent;
                    }).sort(function (a, b) {
                        if (a.CourtId < b.CourtId)
                            return -1;
                        if (a.CourtId > b.CourtId)
                            return 1;
                        return 0;
                    });
                    length += nextLevel.length;
                    header.push(nextLevel);
                    index = header.length - 1;
                    stopper++;
                }
                this.headerData = header;
                this.courts = groupedByCelSizeArray;
                this.render();
            };
            FixiGridHeader.prototype.convertUnitCellToCourt = function (game, unitCell) {
                var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
                var requiredTypeCourts = this.countHeader.selectAll("[type='" + currentGameCourt.Type + "']").data();
                var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));
                return requiredTypeCourts[requiredIndex];
            };
            return FixiGridHeader;
        }());
        FixiGridComponents.FixiGridHeader = FixiGridHeader;
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=header.js.map