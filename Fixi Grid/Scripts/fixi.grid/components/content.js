/// <reference path="d3elements/game.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var content = (function () {
        function content(args) {
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
            this.gameDragBehavior = new fixiGridComponents.behaviors.gameDragBehavior(this.axis.y, this.scale.y, function () { return _this.courtDict; });
            $(this.gameDragBehavior).on("change", function (e, xy, target, data) {
                //TODO: Fix issue with courts
                var courtId = _this.scale.x.invert(xy[0]) + 1;
                var from = _this.scale.y.invert(xy[1]);
                var to = _this.scale.y.invert(xy[1] + parseInt(target.selectAll(".game-aria").attr("height")));
                $(_this).trigger("ongamechange", [data, courtId, from, to]);
            });
            this.gridRender();
        }
        Object.defineProperty(content.prototype, "courtDict", {
            get: function () { return this._courtDict; },
            set: function (dict) { this._courtDict = dict; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(content.prototype, "courts", {
            get: function () { return this._courts; },
            set: function (values) {
                this._courts = values;
                this.gridReposition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(content.prototype, "games", {
            get: function () { return this._games; },
            set: function (games) {
                var _this = this;
                this._games = games;
                var d3Games = fixiGridComponents.elements.game.render(this.d3svgcontent, this._games);
                $(d3Games).on("ongameclick", function (e, d, type) {
                    $(_this).trigger("ongameclick", [d, type]);
                });
                d3Games.selectAll(".game-aria")
                    .call(this.gameDragBehavior.behavior);
                this.reposition();
            },
            enumerable: true,
            configurable: true
        });
        content.prototype.render = function (courts, games) {
            this.courts = courts;
            this.games = games;
        };
        content.prototype.reposition = function () {
            this.gridReposition();
            fixiGridComponents.elements.game.reposition(this.d3svgcontent, this.scale.y, this.courtDict);
        };
        content.prototype.gridRender = function () {
            this.d3svgcontent.append("g").classed("axis-x", true);
            this.d3svgcontent.append("g").classed("axis-y", true);
        };
        content.prototype.gridReposition = function () {
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
        return content;
    })();
    fixiGridComponents.content = content;
})(fixiGridComponents || (fixiGridComponents = {}));
//# sourceMappingURL=content.js.map