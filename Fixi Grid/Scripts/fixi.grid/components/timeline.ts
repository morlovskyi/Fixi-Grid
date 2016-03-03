namespace fixiGridComponents {
    export class timeLine {
        public scale = d3.time.scale();
        public axis = d3.svg.axis();
        public args: fixiGridTimeLineArgs;
        public tickCount = 0;
        private fixiGridSize = {
            width: 0,
            height: 0
        }
        constructor(args: fixiGridTimeLineArgs) {
            this.args = args;
            this.axis.orient('left')
                .scale(this.scale)
                .ticks(d3.time.hour, 1)
                .tickPadding(-65)
                .tickFormat(d3.time.format("%I %p"));
            this.args.d3Container.append("rect")
                .classed("timeline-back", true)

        }

        public setDate(from: Date, to: Date) {
            if (to < from) return;

            this.scale.domain([from, to])
            this.tickCount = (to.getTime() - from.getTime()) / 1000 / 60 / 60

            this.render();
        }

        private render() {
            this.args.d3Container.append("g").classed("timeLine", true)
            this.reposition();
        }
        public refreshSize(width: number, height: number) {
            this.fixiGridSize.width = width;
            this.fixiGridSize.height = width;

            this.axis.tickSize(90, 1)
            this.scale.range([0, this.tickCount * 80])

            this.reposition();
        }
        public reposition() {
            var timeline = this.args.d3Container.select(".timeLine");
           
            timeline.call(this.axis)
            this.args.d3Container.select(".timeline-back")
                .attr({
                    x: -90,
                    width: 90,
                    height: this.fixiGridSize.height
                })
                .style({
                    fill: "#fafafa"
                })

            timeline.selectAll("text").attr({
                dy: 18
            })
        }
    }
}