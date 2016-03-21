namespace FixiGridUI.FixiGridComponents {
    export class TimeLine {
        public scale = d3.time.scale();

        public axis = d3.svg.axis();

        public args: FixiGridTimeLineArgs;

        public tickCount = 0;

        private fixiGridSize = {
            width: 0,
            height: 0,
            timeLineWidth: 0
        }

        constructor(args: FixiGridTimeLineArgs) {
            this.args = args;
            this.axis.orient('left')
                .scale(this.scale)
                .ticks(d3.time.hour, 1)
                .tickPadding(-40)
                .tickFormat(d3.time.format("%I %p"));

            this.args.d3Container.append("rect")
                .classed("TimeLine-back", true)
        }
        public from: Date
        public to: Date
        public setDate(from: Date, to: Date) {
            if (to < from) return;
            this.from = from;
            this.to = to;
            this.scale.domain([from, to])

            this.tickCount = (to.getTime() - from.getTime()) / 1000 / 60 / 60

            this.render();
        }

        private render() {
            this.args.d3Container.append("g").classed("TimeLine", true)
            this.reposition();
        }

        public refreshSize(config: Models.SizeConfiguration) {
            this.fixiGridSize.width = config.width;
            this.fixiGridSize.height = config.height;
            this.fixiGridSize.timeLineWidth = config.timeLineWidth;
            this.axis.tickSize(this.fixiGridSize.timeLineWidth, 1)
            this.scale.range([0, this.tickCount * 80])

            this.reposition();
        }

        public reposition() {
            var TimeLine = this.args.d3Container.select(".TimeLine");

            TimeLine.call(this.axis)
            this.args.d3Container.select(".TimeLine-back")
                .attr({
                    x: -this.fixiGridSize.timeLineWidth,
                    width: this.fixiGridSize.timeLineWidth,
                    height: this.fixiGridSize.height
                })
                .style({
                    fill: "#fafafa"
                })

            TimeLine.selectAll("text").attr({
                dy: 18
            })
        }
    }

    export interface FixiGridTimeLineArgs {
        d3Container: d3.Selection<any>
    }
}