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
                $([this.gameDragBehavior, this.gameResizeTopBehavior, this.gameResizeDownBehavior]).on("change", function (e, xy, target, data) {
                    $(_this).trigger("ongamechange", {
                        data: data,
                        unitCell: _this.scale.x.invert(xy.left),
                        from: _this.scale.y.invert(xy.top),
                        to: _this.scale.y.invert(xy.top + xy.height)
                    });
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
                            color: court.Color,
                            position: this.scale.x(court.ColSpan) * j,
                            size: this.scale.x(court.ColSpan)
                        };
                    }
                }
                this.axis.x.tickSize(-this.scale.y.range()[1], 1);
                this.axis.y.tickSize(-this.scale.x.range()[1], 1);
                this.d3svgcontent.select("g.axis-x").call(this.axis.x);
                this.d3svgcontent.select("g.axis-y").call(this.axis.y);
            };
            return Content;
        }());
        FixiGridComponents.Content = Content;
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
