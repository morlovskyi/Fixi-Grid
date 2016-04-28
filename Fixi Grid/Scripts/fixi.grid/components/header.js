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
                    var courtHeaders = _this.countHeader.selectAll("tr").data(_this.courts);
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
                    }).text(function (d) { return d.CourtName; });
                    //this.reposition();
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
                this.fixiGridSize.width = config.width;
                this.fixiGridSize.height = config.height;
                this.scale.range([0, config.width - config.timeLineWidth]);
                //this.reposition();
            };
            FixiGridHeader.prototype.setCourts = function (courts) {
                this.originalCourts = courts;
                var groupedByCelSize = FixiGridUI.Utils.groupBy(courts, "ColSpan");
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
            //public reposition() {
            //    var type = this.countHeader.selectAll(".court-type")
            //    var court = type.selectAll(".court");
            //    court.attr({
            //        transform: (d, i) => {
            //            return "translate(" + this.scale(d.ColSpan) * i + ",0)"
            //        }
            //    })
            //    court.selectAll(".court-title").attr({
            //        dx: (d, i) => { return this.scale(d.ColSpan) / 2 }
            //    })
            //    court.selectAll(".court-line-2")
            //        .attr({
            //            x1: (d, i, y) => {
            //                return this.scale(d.ColSpan)
            //            },
            //            x2: (d, i, y) => {
            //                return this.scale(d.ColSpan)
            //            },
            //            y1: 0,
            //            y2: -30,
            //        })
            //    court.selectAll(".court-line-3")
            //        .attr({
            //            x1: 0,
            //            x2: (d) => { return this.scale(d.ColSpan) },
            //            y1: 0,
            //            y2: 0
            //        })
            //}
            FixiGridHeader.prototype.convertUnitCellToCourt = function (game, unitCell) {
                var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
                var requiredColSpanCourts = this.countHeader.selectAll("[colspan='" + currentGameCourt.ColSpan + "']").data();
                var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));
                return requiredColSpanCourts[requiredIndex];
            };
            return FixiGridHeader;
        }());
        FixiGridComponents.FixiGridHeader = FixiGridHeader;
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=header.js.map