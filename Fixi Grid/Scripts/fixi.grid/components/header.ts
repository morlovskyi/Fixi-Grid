﻿/// <reference path="../../typings/d3/d3.d.ts" />
namespace FixiGridUI.FixiGridComponents {
    export class FixiGridHeader {
        private options: FixiGridHeaderArgs;
        public originalCourts: FixiCourtDB[];
        private fixiGridSize = {
            width: 0,
            height: 0
        }
        public countHeader: d3.Selection<FixiCourtDB>;
        get height() { return this.courtLevelCount * 30 };
        get courtLevelCount() { return this.courts.length };

        public scale = d3.scale.linear();
        public courts: FixiCourtDB[][]
        get sectionWidth() { return this.scale(1) }
        public courtMetrikRegistry: any = {};
        constructor(args: FixiGridHeaderArgs) {
            this.options = args;
            this.countHeader = args.d3Container.classed("court-header", true)
        }
        public refreshSize(config: Models.SizeConfiguration) {
            this.fixiGridSize.width = config.width;
            this.fixiGridSize.height = config.height;

            this.scale.range([0, config.width - config.timeLineWidth])
            //this.reposition();
        }
        public setCourts(courts: FixiCourtDB[]) {
            this.originalCourts = courts;
            var groupedByCelSize = Utils.groupBy(courts, "ColSpan")
            var max = 0;
            var groupedByCelSizeArray: FixiCourtDB[][] = [];
            for (var i in groupedByCelSize) {
                max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length
                groupedByCelSizeArray.push(groupedByCelSize[i])
            }
            this.scale.domain([0, max])

            this.courts = groupedByCelSizeArray;

            this.render();
        }
        public render = () => {
            var courtHeaders = this.countHeader.selectAll("tr").data(this.courts);
            courtHeaders.exit().remove();
            var courtTypes = courtHeaders.enter()
                .append("tr")
                .classed("court-type", true)

            var court = courtTypes.selectAll<FixiCourtDB[]>("th")
                .data((d) => { return d })

            court.exit().remove();
            var countSection = court.enter().append("th")
                .classed("court", true)
                .attr({
                    "data-id": (d) => { return d.CourtId },
                    "colspan": (d) => { return d.ColSpan },
                    "rowspan": (d) => { return d.RowSpan },
                }).text((d) => { return d.CourtName })

            //this.reposition();
        }
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
        public convertUnitCellToCourt(game: FixiCourtGame, unitCell: number): FixiCourtDB {
            var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
            var requiredColSpanCourts = this.countHeader.selectAll("[colspan='" + currentGameCourt.ColSpan + "']").data();
            var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));

            return requiredColSpanCourts[requiredIndex];
        }
    }
    export interface FixiGridHeaderArgs {
        d3Container: d3.Selection<any>
    }
    export interface FixiCourtDB {
        CourtId: number
        CourtName: string
        ParentCourtId: number
        ColSpan: number
        RowSpan: number
        Color: string
    }
}

