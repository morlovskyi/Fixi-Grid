var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var gameDragBehavior = (function () {
            function gameDragBehavior(axisX, scaleY, courtDict) {
                this.animatinoDuration = 150;
                this.axisX = axisX;
                this.scaleY = scaleY;
                this.courtDict = courtDict;
                this.behavior = d3.behavior.drag()
                    .on("dragstart", this.dragStart.bind(this))
                    .on("drag", this.drag.bind(this))
                    .on("dragend", this.dragEnd.bind(this));
            }
            gameDragBehavior.prototype.dragStart = function () {
                var gElement = $(event.srcElement).parent().get(0);
                var clone = $(gElement).clone();
                this.target = d3.select(gElement).classed("dragged", true);
                this.shadow = d3.select(clone.get(0)).classed("shadow", true);
                this.rect = d3.transform(this.shadow.attr("transform")).translate;
                clone.appendTo($(gElement).parent());
            };
            gameDragBehavior.prototype.drag = function (d) {
                var event = d3.event;
                var courtSize = this.courtDict()[d.courtId].size;
                var x = this.rect[0] + event.x;
                var left = x - x % courtSize;
                var y = this.scaleY.invert(this.rect[1] + event.y);
                var axisRowValue = this.axisX.ticks()[1];
                y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                var top = this.scaleY(y);
                this.shadow.transition().duration(this.animatinoDuration).ease("sin-out").attr({
                    transform: "translate(" + left + "," + top + ")"
                });
            };
            gameDragBehavior.prototype.dragEnd = function (d) {
                var _this = this;
                setTimeout(function () {
                    _this.target.classed("dragged", false);
                    _this.shadow.remove();
                    $(_this).trigger("change", [d3.transform(_this.shadow.attr("transform")).translate, _this.target, d]);
                }, this.animatinoDuration);
            };
            return gameDragBehavior;
        })();
        behaviors.gameDragBehavior = gameDragBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
var fixiGridComponents;
(function (fixiGridComponents) {
    var elements;
    (function (elements) {
        var game = (function () {
            function game() {
            }
            game.render = function (d3svgcontent, games) {
                var game = d3svgcontent
                    .selectAll(".game")
                    .data(games);
                game.exit().remove();
                game.enter()
                    .append("g")
                    .classed("game", true);
                var gameArea = game.selectAll(".game-aria").data(function (d) { return [d]; });
                gameArea.exit().remove();
                gameArea.enter().append("rect")
                    .classed("game-aria", true)
                    .on("click", function (d) {
                    $(game).trigger("ongameclick", [d, "edit"]);
                })
                    .on("mouseover", function (d, i, y) {
                    d3.select(event.target).classed("f-hover", true);
                })
                    .on("mouseleave", function (d, i, y) {
                    d3.select(event.target).classed("f-hover", false);
                });
                var gameResizeTop = game.selectAll(".game-aria-resize-top").data(function (d) { return [d]; });
                gameResizeTop.exit().remove();
                gameResizeTop.enter().append("rect")
                    .classed("game-aria-resize-top", true);
                var gameResizeDown = game.selectAll(".game-aria-resize-down").data(function (d) { return [d]; });
                gameResizeTop.exit().remove();
                gameResizeTop.enter().append("rect")
                    .classed("game-aria-resize-down", true);
                var gameColor = game.selectAll(".game-color").data(function (d) { return [d]; });
                gameColor.exit().remove();
                gameColor.enter().append("rect")
                    .classed("game-color", true);
                var gameTitle = game.selectAll(".game-title-1").data(function (d) { return [d]; });
                gameTitle.exit().remove();
                gameTitle.enter().append("g")
                    .classed("game-title-1", true);
                var gameTitleText = gameTitle.selectAll(".title").data(function (d) { return [d]; });
                gameTitleText.exit().remove();
                gameTitleText.enter().append("text")
                    .classed("title", true);
                var gameTitleRemoveButton = gameTitle.selectAll(".remove").data(function (d) { return [d]; });
                gameTitleRemoveButton.exit().remove();
                gameTitleRemoveButton.enter().append("text")
                    .classed("remove", true)
                    .attr({
                    "data-role": "button"
                })
                    .on("click", function (d) {
                    $(game).trigger("ongameclick", [d, "remove"]);
                });
                var descriptionGroup = game.selectAll(".description").data(function (d) { return [d]; });
                descriptionGroup.exit().remove();
                descriptionGroup.enter().append("g")
                    .classed("description", true);
                var descriptionText = descriptionGroup.selectAll("text").data(function (d) {
                    var data = [];
                    if (d.division)
                        data.push(d.division);
                    data.push(fixiGridUtils.toTimeString(d.from) + " - " + fixiGridUtils.toTimeString(d.to));
                    return data;
                });
                descriptionText.exit().remove();
                descriptionText.enter()
                    .append("text");
                return game;
            };
            game.reposition = function (d3svgcontent, scaleY, courtDict) {
                var game = d3svgcontent.selectAll(".game")
                    .attr({
                    transform: function (d) { return "translate(" + courtDict[d.courtId].position + "," + scaleY(d.from) + ")"; }
                });
                game.selectAll("rect.game-aria")
                    .attr({
                    width: function (d) {
                        return courtDict[d.courtId].size - 4;
                    },
                    height: function (d) {
                        return scaleY(d.to) - scaleY(d.from);
                    }
                });
                game.selectAll(".game-aria-resize-top")
                    .attr({
                    width: function (d) { return courtDict[d.courtId].size - 4; },
                    height: 10,
                });
                game.selectAll(".game-aria-resize-down")
                    .attr({
                    width: function (d) { return courtDict[d.courtId].size - 4; },
                    height: 10,
                    y: function (d) { return scaleY(d.to) - scaleY(d.from) - 10; },
                });
                game.selectAll("rect.game-color")
                    .attr({
                    x: function (d) { return 4; },
                    width: 10,
                    y: function (d) { return 3; },
                    height: function (d) { return scaleY(d.to) - scaleY(d.from) - 5; }
                })
                    .style({
                    fill: function (d) { return courtDict[d.courtId].color; }
                });
                game.selectAll("text.title")
                    .attr({
                    dy: "14px",
                    x: function (d) {
                        return courtDict[d.courtId].size / 2;
                    }
                })
                    .text(function (d) { return d.user; });
                game.selectAll("text.remove")
                    .attr({
                    dx: "-15px",
                    dy: 13,
                    x: function (d) {
                        return courtDict[d.courtId].size;
                    }
                })
                    .text("x");
                game.selectAll(".description")
                    .attr({ transform: function (d, i) { return "translate(" + (courtDict[d.courtId].size / 2) + ",0)"; } });
                game.selectAll(".description text")
                    .attr({
                    dy: 25,
                    dx: 5,
                    transform: function (d, i) { return "translate(" + 0 + "," + i * 10 + ")"; }
                })
                    .style({
                    "text-anchor": "middle"
                })
                    .text(function (d) { return d; });
            };
            return game;
        })();
        elements.game = game;
    })(elements = fixiGridComponents.elements || (fixiGridComponents.elements = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
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
//namespace fixiGridModels {
//    export class court implements fixiCourt {
//        public title: string;
//        public percent: number = 0.5;
//        public subCourt: court[];
//        constructor(args: fixiCourt) {
//            this.title = args.title;
//            this.subCourt = args.subCourt ? args.subCourt.map(x=> { return new court(x) }) : [];
//        }
//    }
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../models/court.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var fixiGridHeader = (function () {
        function fixiGridHeader(args) {
            var _this = this;
            this.fixiGridSize = {
                width: 0,
                height: 0
            };
            this.scale = d3.scale.linear();
            this.courtMetrikRegistry = {};
            this.render = function () {
                var courtHeaders = _this.countHeader.selectAll("g").data(_this.courts);
                courtHeaders.exit().remove();
                var courtTypes = courtHeaders.enter()
                    .append("g")
                    .classed("court-type", true);
                var court = courtTypes.selectAll(".court")
                    .data(function (d) { return d; });
                court.exit().remove();
                var countSection = court.enter().append("g")
                    .classed("court", true)
                    .attr({
                    "data-id": function (d) { return d.CourtId; }
                });
                countSection.append("text")
                    .classed("court-title", true)
                    .attr({
                    dy: "-1em"
                })
                    .text(function (d) { return d.CourtName; });
                countSection.append("line")
                    .classed("court-line-1", true)
                    .attr({
                    stroke: "silver",
                    opacity: 0.2
                });
                countSection.append("line")
                    .classed("court-line-2", true)
                    .attr({
                    stroke: "black",
                    opacity: 0.125
                });
                countSection.append("line")
                    .classed("court-line-3", true)
                    .attr({
                    stroke: "black",
                    opacity: 0.125
                });
                _this.reposition();
            };
            this.options = args;
            this.countHeader = args.d3Container.append("g").classed("court-header", true);
        }
        Object.defineProperty(fixiGridHeader.prototype, "height", {
            get: function () { return this.courtLevelCount * 30; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(fixiGridHeader.prototype, "courtLevelCount", {
            get: function () { return this.courts.length; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(fixiGridHeader.prototype, "sectionWidth", {
            get: function () { return this.scale(1); },
            enumerable: true,
            configurable: true
        });
        fixiGridHeader.prototype.refreshSize = function (width, height) {
            this.fixiGridSize.width = width;
            this.fixiGridSize.height = width;
            this.scale.range([0, width - 90]);
            this.reposition();
        };
        fixiGridHeader.prototype.setCourts = function (courts) {
            var groupedByCelSize = fixiGridUtils.groupBy(courts, "ColSpan");
            var max = 0;
            var groupedByCelSizeArray = [];
            for (var i in groupedByCelSize) {
                max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length;
                groupedByCelSizeArray.push(groupedByCelSize[i]);
            }
            this.scale.domain([0, max]);
            this.courts = groupedByCelSizeArray;
            this.render();
        };
        fixiGridHeader.prototype.reposition = function () {
            var _this = this;
            var type = this.countHeader.selectAll(".court-type").attr({
                transform: function (d, i) { return "translate(0," + (30 * i) + ")"; }
            });
            var court = type.selectAll(".court");
            court.attr({
                transform: function (d, i) {
                    return "translate(" + _this.scale(d.ColSpan) * i + ",0)";
                }
            });
            court.selectAll(".court-title").attr({
                dx: function (d, i) { return _this.scale(d.ColSpan) / 2; }
            });
            court.selectAll(".court-line-2")
                .attr({
                x1: function (d, i, y) {
                    return _this.scale(d.ColSpan);
                },
                x2: function (d, i, y) {
                    return _this.scale(d.ColSpan);
                },
                y1: 0,
                y2: -30,
            });
            court.selectAll(".court-line-3")
                .attr({
                x1: 0,
                x2: function (d) { return _this.scale(d.ColSpan); },
                y1: 0,
                y2: 0
            });
        };
        fixiGridHeader.prototype.courtPosition = function (courtId) {
            for (var i = 0, length = this.courts.length; i < length; i++) {
                var type = this.courts[i];
                for (var j = 0, jlength = type.length; j < jlength; j++) {
                    var court = type[j];
                    if (court.CourtId == courtId) {
                        return this.scale(court.ColSpan) * j;
                    }
                }
            }
        };
        fixiGridHeader.prototype.courtSize = function (courtId) {
            for (var i = 0, length = this.courts.length; i < length; i++) {
                var type = this.courts[i];
                for (var j = 0, jlength = type.length; j < jlength; j++) {
                    var court = type[j];
                    if (court.CourtId == courtId)
                        return this.scale(court.ColSpan);
                }
            }
        };
        return fixiGridHeader;
    })();
    fixiGridComponents.fixiGridHeader = fixiGridHeader;
})(fixiGridComponents || (fixiGridComponents = {}));
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
var fixiGridTemplates;
(function (fixiGridTemplates) {
    fixiGridTemplates.grid = '<style>    g.tick line { stroke: #ddd; stroke-width: 1px; fill: aquamarine; }    .courtAxis g text { text-anchor: start !important; }</style><div>    <svg shape-rendering="crispEdges" class="fixiGridHeader" style="width:100%;height: 90px;background:#fafafa">           </svg>    <div style="overflow: auto;position: absolute;top: 90px;left: 0;right: 0;bottom: 0;border-top: 1px solid #ddd;">        <svg shape-rendering="crispEdges" class="fixiGridContent" style="width:100%;">                   </svg>    </div></div>';
})(fixiGridTemplates || (fixiGridTemplates = {}));
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/timeline.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
var fixiGrid = (function () {
    function fixiGrid(options) {
        var _this = this;
        this.config = {
            width: 0,
            height: 0,
            timeLineWidth: 90
        };
        this.components = {
            header: null,
            timeLine: null,
            content: null
        };
        this.destroy = function () {
            $(window).off("resize.fixiGrid");
            _this.container.off("*");
            _this.container.empty();
        };
        this.container = $("#" + options.id);
        this.element = this.container.append(fixiGridTemplates.grid);
        this.d3svgheader = d3.select("#" + options.id + " .fixiGridHeader");
        this.d3svgcontent = d3.select("#" + options.id + " .fixiGridContent");
        this.components.header = new fixiGridComponents.fixiGridHeader({
            d3Container: this.d3svgheader.append("g").attr({ transform: "translate(" + (this.config.timeLineWidth) + "," + 30 + ")" }),
        });
        this.components.timeLine = new fixiGridComponents.timeLine({
            d3Container: this.d3svgcontent.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" }),
        });
        this.components.content = new fixiGridComponents.content({
            d3Container: this.d3svgcontent.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" }),
            scaleX: this.components.header.scale,
            scaleY: this.components.timeLine.scale
        });
        $(this.components.content).on("ongameclick", function (e, data, type) {
            if (type == "remove" && options.event && options.event.onRemove)
                options.event.onRemove(data, e);
            if (type == "edit" && options.event && options.event.onOpen)
                options.event.onOpen(data, e);
        });
        $(this.components.content).on("ongamechange", function (e, data, courtId, from, to) {
            if (options.event && options.event.onChange)
                options.event.onChange(data, courtId, from, to);
        });
        $(window).on("resize.fixiGrid", function () { _this.refreshSize(); });
    }
    fixiGrid.prototype.setData = function (args) {
        this.components.content.render(this.components.header.courts, args.games);
    };
    fixiGrid.prototype.setCourt = function (courts, from, to) {
        this.components.header.setCourts(courts);
        this.components.timeLine.setDate(from, to);
        this.refreshSize();
    };
    fixiGrid.prototype.refreshSize = function () {
        this.config.width = this.container.width() - 25;
        this.config.height = this.container.height();
        this.components.header.refreshSize(this.config.width, this.config.height);
        this.components.timeLine.refreshSize(this.config.width, this.config.height);
        this.components.content.reposition();
        this.d3svgcontent.attr({ height: this.components.timeLine.scale.range()[1] });
    };
    return fixiGrid;
})();
var fixiGridUtils;
(function (fixiGridUtils) {
    function groupBy(array, field) {
        var dict = {};
        array.forEach(function (item) {
            if (!dict[item[field]])
                dict[item[field]] = [];
            dict[item[field]].push(item);
        });
        return dict;
    }
    fixiGridUtils.groupBy = groupBy;
    function toTimeString(date) {
        var hour = date.getHours();
        var zz = "AM";
        if (hour > 12) {
            hour -= 12;
            zz = "PM";
        }
        var minute = date.getMinutes().toString();
        if (minute.length == 1)
            minute = "0" + minute;
        return hour + ":" + minute + " " + zz;
    }
    fixiGridUtils.toTimeString = toTimeString;
})(fixiGridUtils || (fixiGridUtils = {}));
/// <reference path="court.ts" />
//# sourceMappingURL=fixi.grid.js.map