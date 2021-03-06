/// <reference path="d3elements/game.ts" />
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Content = (function () {
            function Content(args) {
                var _this = this;
                this.scale = {
                    x: null,
                    y: null
                };
                this._courtDict = {};
                this._courts = [];
                this._games = [];
                this.axis = {
                    x: d3.svg.axis(),
                    y: d3.svg.axis()
                };
                this.d3svgcontent = args.d3Container.classed("games", true);
                this.scale.x = args.scaleX;
                this.scale.y = args.scaleY;
                this.axis.x.orient('top')
                    .scale(this.scale.x)
                    .tickFormat("");
                this.axis.y.orient('left')
                    .scale(this.scale.y)
                    .ticks(d3.time.minute, 15)
                    .tickFormat("");
                this.gameDragBehavior = new FixiGridComponents.Behaviors.GameDragBehavior(this.axis.y, this.scale.y, function () { return _this.courtDict; });
                this.gameResizeTopBehavior = new FixiGridComponents.Behaviors.GameResizeTopBehavior(this.axis.y, this.scale.y, function () { return _this.courtDict; });
                this.gameResizeDownBehavior = new FixiGridComponents.Behaviors.GameResizeDownBehavior(this.axis.y, this.scale.y, function () { return _this.courtDict; });
                $(this.gameDragBehavior).on("edit", function (e, d) {
                    return $(_this).trigger("ongameclick", {
                        data: d,
                        type: "edit"
                    });
                });
                $([this.gameDragBehavior, this.gameResizeTopBehavior, this.gameResizeDownBehavior]).on("change", function (e, xy, target, data) {
                    //var courtPosition = this.scale.x.invert(xy.left);
                    //for (var id in this.courtDict) {
                    //if (this.courtDict[id].position == courtPosition) {
                    $(_this).trigger("ongamechange", {
                        data: data,
                        courtId: data.courtId,
                        from: _this.calibrateDate(_this.scale.y.invert(xy.top)),
                        to: _this.calibrateDate(_this.scale.y.invert(xy.top + xy.height))
                    });
                    //return;
                    //}
                    //}
                });
                this.gridRender();
            }
            Object.defineProperty(Content.prototype, "courtDict", {
                get: function () { return this._courtDict; },
                set: function (dict) { this._courtDict = dict; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Content.prototype, "courts", {
                get: function () { return this._courts; },
                set: function (values) {
                    this._courts = values;
                    this.gridReposition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Content.prototype, "games", {
                get: function () { return this._games; },
                set: function (games) {
                    var _this = this;
                    this._games = games;
                    var d3Games = FixiGridComponents.Elements.Game.render(this.d3svgcontent, this._games);
                    $(d3Games).on("ongameclick", function (e, d, type) {
                        $(_this).trigger("ongameclick", {
                            data: d,
                            type: type
                        });
                    });
                    d3Games.selectAll(".game-aria")
                        .call(this.gameDragBehavior.behavior);
                    d3Games.selectAll(".game-aria-resize-top")
                        .call(this.gameResizeTopBehavior.behavior);
                    d3Games.selectAll(".game-aria-resize-down")
                        .call(this.gameResizeDownBehavior.behavior);
                    this.reposition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Content.prototype, "dragValidation", {
                set: function (validation) {
                    this.gameDragBehavior.isGamePositionValid = validation;
                    this.gameResizeTopBehavior.isGamePositionValid = validation;
                    this.gameResizeDownBehavior.isGamePositionValid = validation;
                },
                enumerable: true,
                configurable: true
            });
            Content.prototype.setGameMinTimeRange = function (value) {
                if (value === void 0) { value = 15; }
                this.gameResizeTopBehavior.minGameTimeRange = this.gameResizeDownBehavior.minGameTimeRange = value;
            };
            Content.prototype.render = function (courts, games) {
                this.courts = courts;
                this.games = games;
            };
            Content.prototype.reposition = function () {
                this.gridReposition();
                FixiGridComponents.Elements.Game.reposition(this.d3svgcontent, this.scale.y, this.courtDict);
            };
            Content.prototype.gridRender = function () {
                this.d3svgcontent.append("g").classed("axis-x", true);
                this.d3svgcontent.append("g").classed("axis-y", true);
            };
            Content.prototype.gridReposition = function () {
                this.courtDict = {};
                for (var i = 0, length = this.courts.length; i < length; i++) {
                    var type = this.courts[i];
                    for (var j = 0, jlength = type.length; j < jlength; j++) {
                        var court = type[j];
                        this.courtDict[court.CourtId] = {
                            id: court.CourtId,
                            color: court.Color,
                            position: $("[data-id='" + court.CourtId + "']").get(0).offsetLeft,
                            size: $("[data-id='" + court.CourtId + "']").get(0).offsetWidth,
                            court: court,
                            type: court.Type
                        };
                    }
                }
                this.axis.x.tickSize(-this.scale.y.range()[1], 1);
                this.axis.y.tickSize(-this.scale.x.range()[1], 1);
                this.d3svgcontent.select("g.axis-x").html("");
                var content = this.d3svgcontent;
                var height = this.scale.y.range()[1];
                d3.select($(this.d3svgcontent[0]).parents('[data-role="root"]').get(0))
                    .selectAll('[data-role="header"] tr')
                    .selectAll('th')
                    .each(function (d, i, y) {
                    //if (y != 0) return;
                    var tick = content.select("g.axis-x").append("g")
                        .classed("tick", true)
                        .attr("transform", "translate(" + (d3.select(this).property("offsetLeft") + d3.select(this).property("clientWidth") + 1) + ")");
                    tick.append("line")
                        .attr({
                        x2: 0,
                        y2: height
                    });
                });
                this.d3svgcontent.select("g.axis-y").call(this.axis.y);
            };
            Content.prototype.calibrateDate = function (date) {
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var result = new Date(date.getTime());
                result.setHours(0, 0, 0, 0);
                var dayMinutes = (minutes + hours * 60);
                dayMinutes = parseInt((dayMinutes / 15).toFixed(0)) * 15;
                result.setMinutes(dayMinutes);
                return result;
            };
            return Content;
        }());
        FixiGridComponents.Content = Content;
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=content.js.map