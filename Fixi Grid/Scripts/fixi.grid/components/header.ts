/// <reference path="../../typings/d3/d3.d.ts" />
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
            this.fixiGridSize.width = config.headerWidth;
            this.fixiGridSize.height = config.height;

            this.scale.range([0, config.headerWidth])
            //this.reposition();
        }
        public headerData: FixiCourtDB[][];
        public setCourts(courts: FixiCourtDB[]) {
            this.originalCourts = courts;
            var groupedByCelSize = Utils.groupBy(courts, "ColSpan")
            var max = 0;
            var min = 1000;
            var groupedByCelSizeArray: FixiCourtDB[][] = [];
            for (var i in groupedByCelSize) {
                max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length
                groupedByCelSizeArray.push(groupedByCelSize[i])
                min = (min > parseInt(i)) ? parseInt(i) : min;
            }
            this.scale.domain([0, max]);
            var header: FixiCourtDB[][] = [];
            header.push(this.originalCourts.filter(c => c.ColSpan == min).sort((a, b) => {
                if (a.ParentCourtId < b.ParentCourtId)
                    return -1
                if (a.ParentCourtId > b.ParentCourtId)
                    return 1;
                return 0
            }));
            var length = header[0].length;
            var index = 0;
            var stopper = 0;
            while (length != courts.length || stopper > 10) {
                var nextLevel = this.originalCourts.filter(c => {
                    var isParent;
                    isParent = header[index].filter(child => child.ParentCourtId == c.CourtId).length > 0;
                    return isParent;
                }).sort((a, b) => {
                    if (a.CourtId < b.CourtId)
                        return -1
                    if (a.CourtId > b.CourtId)
                        return 1;
                    return 0
                })
                length += nextLevel.length;
                header.push(nextLevel)
                index = header.length - 1;
                stopper++;
            }
            this.headerData = header;
            this.courts = groupedByCelSizeArray;

            this.render();
        }
        public render = () => {
            var courtHeaders = this.countHeader.selectAll("tr").data(this.headerData);
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
                    "type": (d) => d.Type
                }).text((d) => { return d.CourtName })

        }

        public convertUnitCellToCourt(game: FixiCourtGame, unitCell: number): FixiCourtDB {
            var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
            var requiredTypeCourts = this.countHeader.selectAll("[type='" + currentGameCourt.Type + "']").data();
            var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));

            return requiredTypeCourts[requiredIndex];
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
        Type: number,
        Color: string
    }
}

