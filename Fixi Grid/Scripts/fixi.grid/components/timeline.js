var fixiGridComponents;
(function (fixiGridComponents) {
    var timeLine = (function () {
        function timeLine(args) {
            this.scale = d3.time.scale();
            this.axis = d3.svg.axis();
            this.tickCount = 0;
            this.fixiGridSize = {
                width: 0,
                height: 0
            };
            this.args = args;
            this.axis.orient('left')
                .scale(this.scale)
                .ticks(d3.time.hour, 1)
                .tickPadding(-65)
                .tickFormat(d3.time.format("%I %p"));
            this.args.d3Container.append("rect")
                .classed("timeline-back", true);
        }
        timeLine.prototype.setDate = function (from, to) {
            if (to < from)
                return;
            this.scale.domain([from, to]);
            this.tickCount = (to.getTime() - from.getTime()) / 1000 / 60 / 60;
            this.render();
        };
        timeLine.prototype.render = function () {
            this.args.d3Container.append("g").classed("timeLine", true);
            this.reposition();
        };
        timeLine.prototype.refreshSize = function (width, height) {
            this.fixiGridSize.width = width;
            this.fixiGridSize.height = width;
            this.axis.tickSize(90, 1);
            this.scale.range([0, this.tickCount * 80]);
            this.reposition();
        };
        timeLine.prototype.reposition = function () {
            var timeline = this.args.d3Container.select(".timeLine");
            timeline.call(this.axis);
            this.args.d3Container.select(".timeline-back")
                .attr({
                x: -90,
                width: 90,
                height: this.fixiGridSize.height
            })
                .style({
                fill: "#fafafa"
            });
            timeline.selectAll("text").attr({
                dy: 18
            });
        };
        return timeLine;
    })();
    fixiGridComponents.timeLine = timeLine;
})(fixiGridComponents || (fixiGridComponents = {}));
