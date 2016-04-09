var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var TimeLine = (function () {
            function TimeLine(args) {
                this.scale = d3.time.scale();
                this.axis = d3.svg.axis();
                this.tickCount = 0;
                this.fixiGridSize = {
                    width: 0,
                    height: 0,
                    timeLineWidth: 0
                };
                this.args = args;
                this.axis.orient('left')
                    .scale(this.scale)
                    .ticks(d3.time.hour, 1)
                    .tickPadding(-40)
                    .tickFormat(d3.time.format("%I %p"));
                this.args.d3Container.append("rect")
                    .classed("TimeLine-back", true);
            }
            TimeLine.prototype.setDate = function (from, to) {
                if (to < from)
                    return;
                this.from = from;
                this.to = to;
                this.scale.domain([from, to]);
                this.tickCount = (to.getTime() - from.getTime()) / 1000 / 60 / 60;
                this.render();
            };
            TimeLine.prototype.render = function () {
                this.args.d3Container.append("g").classed("TimeLine", true);
                this.reposition();
            };
            TimeLine.prototype.refreshSize = function (config) {
                this.fixiGridSize.width = config.width;
                this.fixiGridSize.height = config.height;
                this.fixiGridSize.timeLineWidth = config.timeLineWidth;
                this.axis.tickSize(this.fixiGridSize.timeLineWidth, 1);
                this.scale.range([0, this.tickCount * 80]);
                this.reposition();
            };
            TimeLine.prototype.reposition = function () {
                var TimeLine = this.args.d3Container.select(".TimeLine");
                TimeLine.call(this.axis);
                this.args.d3Container.select(".TimeLine-back")
                    .attr({
                    x: -this.fixiGridSize.timeLineWidth,
                    width: this.fixiGridSize.timeLineWidth,
                    height: this.fixiGridSize.height
                })
                    .style({
                    fill: "#fafafa"
                });
                TimeLine.selectAll("text").attr({
                    dy: 18
                });
            };
            return TimeLine;
        }());
        FixiGridComponents.TimeLine = TimeLine;
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=TimeLine.js.map