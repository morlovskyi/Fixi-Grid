﻿/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../models/court.ts" />
namespace fixiGridComponents {
    export class fixiGridHeader {
        private options: fixiGridHeaderArgs;
        private fixiGridSize = {
            width: 0,
            height: 0
        }
        public countHeader: d3.Selection<fixiCourtDB>;
        get height() { return this.courtLevelCount * 30 };
        get courtLevelCount() { return this.courts.length };

        public scale = d3.scale.linear();
        public courts: fixiCourtDB[][]
        get sectionWidth() { return this.scale(1) }
        public courtMetrikRegistry: any = {};
        constructor(args: fixiGridHeaderArgs) {
            this.options = args;
            this.countHeader = args.d3Container.append("g").classed("court-header", true)
        }
        public refreshSize(width: number, height: number) {
            this.fixiGridSize.width = width;
            this.fixiGridSize.height = width;

            this.scale.range([0, width - 90])
            this.reposition();
        }
        public setCourts(courts: fixiCourtDB[]) {
            var groupedByCelSize = fixiGridUtils.groupBy(courts, "ColSpan")
            var max = 0;
            var groupedByCelSizeArray: fixiCourtDB[][] = [];
            for (var i in groupedByCelSize) {
                max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length
                groupedByCelSizeArray.push(groupedByCelSize[i])
            }
            this.scale.domain([0, max])

            this.courts = groupedByCelSizeArray;

            this.render();
        }
        public render = () => {
            var courtHeaders = this.countHeader.selectAll("g").data(this.courts);
            courtHeaders.exit().remove();
            var courtTypes = courtHeaders.enter()
                .append("g")
                .classed("court-type", true)

            var court = courtTypes.selectAll<fixiCourtDB[]>(".court")
                .data((d) => { return d })

            court.exit().remove();
            var countSection = court.enter().append("g")
                .classed("court", true)
                .attr({
                    "data-id": (d) => { return d.CourtId }
                })

            countSection.append("text")
                .classed("court-title", true)
                .attr({
                    dy: "-1em"
                })
                .text((d) => { return d.CourtName })

            countSection.append("line")
                .classed("court-line-1", true)
                .attr({
                    stroke: "silver",
                    opacity: 0.2
                })

            countSection.append("line")
                .classed("court-line-2", true)
                .attr({
                    stroke: "black",
                    opacity: 0.125
                })
            countSection.append("line")
                .classed("court-line-3", true)
                .attr({
                    stroke: "black",
                    opacity: 0.125
                })

            this.reposition();

        }
        public reposition() {
            var type = this.countHeader.selectAll(".court-type").attr({
                transform: (d, i) => { return "translate(0," + (30 * i) + ")" }
            })

            var court = type.selectAll(".court");
            court.attr({
                transform: (d, i) => {
                    return "translate(" + this.scale(d.ColSpan) * i + ",0)"
                }
            })

            court.selectAll(".court-title").attr({
                dx: (d, i) => { return this.scale(d.ColSpan) / 2 }
            })


            court.selectAll(".court-line-2")
                .attr({
                    x1: (d, i, y) => {
                        return this.scale(d.ColSpan)
                    },
                    x2: (d, i, y) => {
                        return this.scale(d.ColSpan)
                    },
                    y1: 0,
                    y2: -30,
                })

            court.selectAll(".court-line-3")
                .attr({
                    x1: 0,
                    x2: (d) => { return this.scale(d.ColSpan) },
                    y1: 0,
                    y2: 0
                })
        }
        public courtPosition(courtId: number) {
            for (var i = 0, length = this.courts.length; i < length; i++) {
                var type = this.courts[i];
                for (var j = 0, jlength = type.length; j < jlength; j++) {
                    var court = type[j];
                    if (court.CourtId == courtId) {
                        return this.scale(court.ColSpan) * j
                    }
                }
            }
        }
        public courtSize(courtId: number) {
            for (var i = 0, length = this.courts.length; i < length; i++) {
                var type = this.courts[i];
                for (var j = 0, jlength = type.length; j < jlength; j++) {
                    var court = type[j];
                    if (court.CourtId == courtId)
                        return this.scale(court.ColSpan)
                }
            }
        }
    }
}
