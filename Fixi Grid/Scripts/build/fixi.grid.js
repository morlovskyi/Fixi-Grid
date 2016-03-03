var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var baseDragBehavior = (function () {
            function baseDragBehavior(axisX, scaleY, courtDict) {
                this.animatinoDuration = 150;
                this.targetClass = "";
                this.shadowClass = "";
                this.axisX = axisX;
                this.scaleY = scaleY;
                this.courtDict = courtDict;
                this.behavior = d3.behavior.drag()
                    .on("dragstart", this.dragStart.bind(this))
                    .on("drag", this.drag.bind(this))
                    .on("dragend", this.dragEnd.bind(this));
            }
            baseDragBehavior.prototype.dragStart = function () {
                var gElement = $(event.srcElement).parent().get(0);
                var clone = $(gElement).clone();
                this.target = d3.select(gElement).classed(this.targetClass, true);
                this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
                this.gameAria = this.shadow.select(".game-aria");
                this.gameAriaHeightOriginal = parseInt(this.gameAria.attr("height"));
                this.rect = d3.transform(this.shadow.attr("transform")).translate;
                this.dragStartPageX = event.pageX;
                this.dragStartPageY = event.pageY;
                clone.appendTo($(gElement).parent());
            };
            baseDragBehavior.prototype.drag = function (d) {
            };
            baseDragBehavior.prototype.dragEnd = function (d) {
                var _this = this;
                setTimeout(function () {
                    _this.target.classed(_this.targetClass, false);
                    _this.shadow.remove();
                    var translate = d3.transform(_this.shadow.attr("transform")).translate;
                    var result = {
                        left: translate[0],
                        top: translate[1],
                        width: parseFloat(_this.shadow.select("rect.game-aria").attr("width")),
                        height: parseFloat(_this.shadow.select("rect.game-aria").attr("height"))
                    };
                    $(_this).trigger("change", [result, _this.target, d]);
                }, this.animatinoDuration);
            };
            return baseDragBehavior;
        })();
        behaviors.baseDragBehavior = baseDragBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var gameDragBehavior = (function (_super) {
            __extends(gameDragBehavior, _super);
            function gameDragBehavior() {
                _super.apply(this, arguments);
                this.targetClass = "dragged";
                this.shadowClass = "shadow";
            }
            gameDragBehavior.prototype.drag = function (d) {
                var tempX = event.pageX - this.dragStartPageX;
                var courtSize = this.courtDict()[d.courtId].size;
                var x = this.rect[0] + tempX + courtSize / 2;
                var left = x - x % courtSize;
                var tempY = event.pageY - this.dragStartPageY;
                var y = this.scaleY.invert(this.rect[1] + tempY);
                var axisRowValue = this.axisX.ticks()[1];
                y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                var top = this.scaleY(y);
                if (left < 0 || top < 0)
                    return;
                this.shadow.transition().duration(this.animatinoDuration).ease("sin-out").attr({
                    transform: "translate(" + left + "," + top + ")"
                });
            };
            return gameDragBehavior;
        })(behaviors.baseDragBehavior);
        behaviors.gameDragBehavior = gameDragBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
/// <reference path="base.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var gameResizeDownBehavior = (function (_super) {
            __extends(gameResizeDownBehavior, _super);
            function gameResizeDownBehavior() {
                _super.apply(this, arguments);
                this.shadowClass = "resize-shadow";
            }
            gameResizeDownBehavior.prototype.drag = function (d) {
                var tempY = event.pageY - this.dragStartPageY;
                var y = this.scaleY.invert(tempY);
                var axisRowValue = this.axisX.ticks()[1];
                y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                var top = this.scaleY(y);
                if (this.gameAriaHeightOriginal + top < 0)
                    return;
                this.gameAria.attr({
                    height: this.gameAriaHeightOriginal + top
                });
            };
            return gameResizeDownBehavior;
        })(behaviors.baseDragBehavior);
        behaviors.gameResizeDownBehavior = gameResizeDownBehavior;
    })(behaviors = fixiGridComponents.behaviors || (fixiGridComponents.behaviors = {}));
})(fixiGridComponents || (fixiGridComponents = {}));
/// <reference path="base.ts" />
var fixiGridComponents;
(function (fixiGridComponents) {
    var behaviors;
    (function (behaviors) {
        var gameResizeTopBehavior = (function (_super) {
            __extends(gameResizeTopBehavior, _super);
            function gameResizeTopBehavior() {
                _super.apply(this, arguments);
                this.shadowClass = "resize-shadow";
            }
            gameResizeTopBehavior.prototype.drag = function (d) {
                var tempY = event.pageY - this.dragStartPageY;
                var y = this.scaleY.invert(this.rect[1] + tempY);
                var axisRowValue = this.axisX.ticks()[1];
                y.setMinutes(y.getMinutes() - (y.getMinutes() % axisRowValue), 0);
                var top = this.scaleY(y);
                if (top < 0 && this.rect[1] - top > 0)
                    return;
                this.shadow.attr({
                    transform: "translate(" + this.rect[0] + "," + top + ")"
                });
                this.gameAria.attr({
                    height: this.gameAriaHeightOriginal + (this.rect[1] - top)
                });
            };
            return gameResizeTopBehavior;
        })(behaviors.baseDragBehavior);
        behaviors.gameResizeTopBehavior = gameResizeTopBehavior;
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
            this.gameResizeTopBehavior = new fixiGridComponents.behaviors.gameResizeTopBehavior(this.axis.y, this.scale.y, function () { return _this.courtDict; });
            this.gameResizeDownBehavior = new fixiGridComponents.behaviors.gameResizeDownBehavior(this.axis.y, this.scale.y, function () { return _this.courtDict; });
            $([this.gameDragBehavior, this.gameResizeTopBehavior, this.gameResizeDownBehavior]).on("change", function (e, xy, target, data) {
                var unitCell = _this.scale.x.invert(xy.left);
                var from = _this.scale.y.invert(xy.top);
                var to = _this.scale.y.invert(xy.top + xy.height);
                $(_this).trigger("ongamechange", [data, unitCell, from, to]);
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
                d3Games.selectAll(".game-aria-resize-top")
                    .call(this.gameResizeTopBehavior.behavior);
                d3Games.selectAll(".game-aria-resize-down")
                    .call(this.gameResizeDownBehavior.behavior);
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
                    "data-id": function (d) { return d.CourtId; },
                    "data-colspan": function (d) { return d.ColSpan; }
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
        fixiGridHeader.prototype.convertUnitCellToCourt = function (game, unitCell) {
            var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
            var requiredColSpanCourts = this.countHeader.selectAll("[data-colspan='" + currentGameCourt.ColSpan + "']").data();
            var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));
            return requiredColSpanCourts[requiredIndex];
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
    fixiGridTemplates.grid = '<style>    g.tick line { stroke: #ddd; stroke-width: 1px; fill: aquamarine; }    .courtAxis g text { text-anchor: start !important; }</style><div>    <svg shape-rendering="crispEdges" class="fixiGridHeader" style="width:100%;height: 90px;background:#fafafa">           </svg>    <div class="fixiGridContentScroll" style="">        <svg shape-rendering="crispEdges" class="fixiGridContent" style="width:100%;">                   </svg>    </div></div>';
})(fixiGridTemplates || (fixiGridTemplates = {}));
var fixiGridTemplates;
(function (fixiGridTemplates) {
    fixiGridTemplates.print = '<!DOCTYPE html><html><head>    <meta charset="utf-8" />    <meta name="viewport" content="width=device-width" />    <link href="Scripts/fixi.grid/style/fixiGrid.css" rel="stylesheet" />    <link href="Scripts/fixi.grid/style/fixiGrid.print.css" rel="stylesheet" />    <style>        g.tick line { stroke: #ddd; stroke-width: 1px; fill: aquamarine; }        .courtAxis g text { text-anchor: start !important; }    </style></head><body>     <div id="fixiGrid">          </div></body></html>';
})(fixiGridTemplates || (fixiGridTemplates = {}));
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/timeline.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
/// <reference path="templates/print.html.ts" />
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
        this.print = function () {
            setTimeout(function () {
                var printerFrame = document.createElement('iframe');
                var printView = $("<html>");
                printView.html(fixiGridTemplates.print);
                printView.find("#fixiGrid").append(_this.container.clone());
                $(window.document.body).append(printerFrame);
                printerFrame.contentWindow.document.writeln(printView.html());
                setTimeout(function () {
                    printerFrame.contentDocument.execCommand('print', false, null);
                    printerFrame.parentNode.removeChild(printerFrame);
                }, 250);
            }, 200);
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
        $(this.components.content).on("ongamechange", function (e, data, unitCell, from, to) {
            var court = _this.components.header.convertUnitCellToCourt(data, unitCell);
            if (options.event && options.event.onChange)
                options.event.onChange(data, court, from, to);
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