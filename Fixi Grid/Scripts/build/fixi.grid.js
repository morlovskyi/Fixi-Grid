var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var BaseDragBehavior = (function () {
                function BaseDragBehavior(axisX, scaleY, courtDict) {
                    this.animatinoDuration = 150;
                    this.targetClass = "";
                    this.shadowClass = "";
                    this.dragged = false;
                    this.availableCourts = [];
                    this.disabled = false;
                    this.minGameTimeRange = 15;
                    this.isGamePositionValid = null;
                    this.axisX = axisX;
                    this.scaleY = scaleY;
                    this.courtDict = courtDict;
                    this.behavior = d3.behavior.drag()
                        .on("dragstart", this.dragStart.bind(this))
                        .on("drag", this.basedrag.bind(this))
                        .on("dragend", this.dragEnd.bind(this));
                }
                Object.defineProperty(BaseDragBehavior.prototype, "targetRect", {
                    get: function () {
                        return {
                            left: this.snapY(d3.transform(this.target.attr("transform")).translate[0]),
                            top: this.snapY(d3.transform(this.target.attr("transform")).translate[1]),
                            width: parseFloat(this.target.select("rect.game-aria").attr("width")),
                            height: parseFloat(this.target.select("rect.game-aria").attr("height"))
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BaseDragBehavior.prototype, "dragResult", {
                    get: function () {
                        return {
                            left: this.snapY(d3.transform(this.shadow.attr("transform")).translate[0]),
                            top: this.snapY(d3.transform(this.shadow.attr("transform")).translate[1]),
                            width: parseFloat(this.shadow.select("rect.game-aria").attr("width")),
                            height: parseFloat(this.shadow.select("rect.game-aria").attr("height"))
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                BaseDragBehavior.prototype.dragStart = function (d) {
                    if (this.disabled)
                        return;
                    this.mouseMoveInfo = new Behaviors.MouseMoveInfo(event);
                    this.dragged = false;
                    var gElement = $(event.srcElement).parent().get(0);
                    var clone = $(gElement).clone();
                    this.availableCourts = [];
                    this.target = d3.select(gElement).classed(this.targetClass, true);
                    this.shadow = d3.select(clone.get(0)).classed(this.shadowClass, true);
                    this.shadow.attr({ "data-court-id": d.courtId });
                    clone.appendTo($(gElement).parent());
                    this.availableCourts = [];
                    var courtsDict = this.courtDict();
                    var type = courtsDict[d.courtId].type;
                    for (var id in courtsDict) {
                        if (courtsDict[id].type == type)
                            this.availableCourts.push(courtsDict[id]);
                    }
                    this.availableCourts.sort(function (a, b) {
                        if (a.position < b.position)
                            return -1;
                        if (a.position > b.position)
                            return 1;
                        return 0;
                    });
                };
                BaseDragBehavior.prototype.snapY = function (y) {
                    var startDate = new Date(this.scaleY.domain()[0].getTime());
                    var axisRowValue = this.axisX.ticks()[1];
                    startDate.setMinutes(startDate.getMinutes() + axisRowValue);
                    var width = this.scaleY(startDate);
                    return y - (y % width) + Math.round((y % width) / width) * width;
                };
                BaseDragBehavior.prototype.basedrag = function (d) {
                    if (this.disabled)
                        return;
                    this.mouseMoveInfo.move(event);
                    this.drag(d);
                    var court = this.getCourtInPoint(this.dragResult.left + 10, this.courtDict()[d.courtId].type);
                    this.shadow.classed("invalid", !this.validate(d, this.dragResult, court.id));
                };
                BaseDragBehavior.prototype.drag = function (d) {
                };
                BaseDragBehavior.prototype.dragEnd = function (d) {
                    if (this.disabled)
                        return;
                    var rect = this.dragResult;
                    var court = this.getCourtInPoint(rect.left + 10, this.courtDict()[d.courtId].type);
                    if (!this.dragged && rect.top == this.targetRect.top && this.targetRect.left == rect.left) {
                        $(this).trigger("edit", d);
                    }
                    else if (this.validate(d, rect, court.id)) {
                        d.courtId = court.id;
                        this.target.select(".game-aria").attr({
                            width: this.courtDict()[d.courtId].size,
                        });
                        this.target.attr({
                            transform: "translate(" + rect.left + "," + rect.top + ")",
                            height: rect.height
                        });
                        $(this).trigger("change", [rect, this.target, d]);
                    }
                    this.target.classed(this.targetClass, false);
                    this.shadow.remove();
                };
                BaseDragBehavior.prototype.isNewHeightValidByLimit = function (newHeight) {
                    var fromDate = this.scaleY.invert(newHeight);
                    var startDate = this.scaleY.domain()[0];
                    return parseInt(((fromDate.getTime() - startDate.getTime()) / 1000 / 60).toString()) >= this.minGameTimeRange;
                };
                BaseDragBehavior.prototype.validate = function (game, dragResult, courtId) {
                    if (this.isGamePositionValid)
                        return this.isGamePositionValid(game, dragResult, courtId);
                    return true;
                };
                BaseDragBehavior.prototype.getCourtInPoint = function (x, type) {
                    var courtsDict = this.courtDict();
                    var distance = 100000;
                    var result = null;
                    for (var id in courtsDict) {
                        var c = courtsDict[id];
                        if (c.position <= x && x < c.position + c.size) {
                            if (x - c.position < distance) {
                                result = c;
                                distance = x - c.position;
                            }
                            if (x - c.position == distance && c.type == type) {
                                result = c;
                            }
                        }
                    }
                    return result;
                };
                return BaseDragBehavior;
            }());
            Behaviors.BaseDragBehavior = BaseDragBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var GameDragBehavior = (function (_super) {
                __extends(GameDragBehavior, _super);
                function GameDragBehavior() {
                    _super.apply(this, arguments);
                    this.targetClass = "dragged";
                    this.shadowClass = "shadow";
                }
                GameDragBehavior.prototype.drag = function (d) {
                    var id = this.shadow.attr("data-court-id");
                    var court = this.courtDict()[id];
                    var shadowXY = d3.transform(this.shadow.attr("transform")).translate;
                    var initialXY = d3.transform(this.target.attr("transform")).translate;
                    var changeCourt = this.getCourtInPoint(event.layerX - 45, court.type);
                    var left = (changeCourt) ? changeCourt.position : shadowXY[0];
                    var width = (changeCourt) ? changeCourt.size : parseInt(this.shadow.select(".game-aria").attr("width"));
                    var type = (changeCourt) ? changeCourt.type : court.type;
                    var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);
                    if (left < 0 || top < 0)
                        return;
                    this.shadow.attr({
                        transform: "translate(" + left + "," + top + ")"
                    });
                    if (court.type == type) {
                        this.shadow.select(".game-aria").attr({
                            width: width
                        });
                        this.shadow.select(".title").attr({
                            x: width / 2
                        });
                        this.shadow.select(".description").attr({
                            transform: "translate(" + width / 2 + ",0)"
                        });
                    }
                    this.dragged = true;
                };
                return GameDragBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameDragBehavior = GameDragBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var GameResizeDownBehavior = (function (_super) {
                __extends(GameResizeDownBehavior, _super);
                function GameResizeDownBehavior() {
                    _super.apply(this, arguments);
                    this.newGameHeight = null;
                    this.shadowClass = "resize-shadow";
                }
                GameResizeDownBehavior.prototype.drag = function (d) {
                    var initialXY = d3.transform(this.target.attr("transform")).translate;
                    var initialGameHeight = parseInt(this.target.select(".game-aria").attr("height"));
                    var height = this.snapY(initialGameHeight + this.mouseMoveInfo.offsetY);
                    if (height < 0)
                        return;
                    if (!this.isNewHeightValidByLimit(height))
                        return;
                    this.shadow.select(".game-aria").attr({
                        height: height
                    });
                    this.dragged = true;
                };
                return GameResizeDownBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameResizeDownBehavior = GameResizeDownBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var GameResizeTopBehavior = (function (_super) {
                __extends(GameResizeTopBehavior, _super);
                function GameResizeTopBehavior() {
                    _super.apply(this, arguments);
                    this.shadowClass = "resize-shadow";
                }
                GameResizeTopBehavior.prototype.drag = function (d) {
                    var initialXY = d3.transform(this.target.attr("transform")).translate;
                    var initialGameHeight = parseInt(this.target.select(".game-aria").attr("height"));
                    var top = this.snapY(initialXY[1] + this.mouseMoveInfo.offsetY);
                    var height = this.snapY(initialGameHeight + (initialXY[1] - top));
                    if (!this.isNewHeightValidByLimit(height))
                        return;
                    this.shadow.attr({
                        transform: "translate(" + initialXY[0] + "," + top + ")"
                    });
                    this.shadow.select(".game-aria").attr({
                        height: height
                    });
                    this.dragged = true;
                };
                return GameResizeTopBehavior;
            }(Behaviors.BaseDragBehavior));
            Behaviors.GameResizeTopBehavior = GameResizeTopBehavior;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Behaviors;
        (function (Behaviors) {
            var MouseMoveInfo = (function () {
                function MouseMoveInfo(startEvent) {
                    var _this = this;
                    this.startEvent = startEvent;
                    this.pageX = 0;
                    this.pageY = 0;
                    this.movementX = 0;
                    this.movementY = 0;
                    this.moveEvent = null;
                    this.move = function (moveEvent) {
                        _this.moveEvent = moveEvent;
                        _this.movementX = _this.moveEvent.pageX - _this.pageX;
                        _this.movementY = _this.moveEvent.pageY - _this.pageY;
                        _this.pageX = _this.moveEvent.pageX;
                        _this.pageY = _this.moveEvent.pageY;
                    };
                    this.pageX = startEvent.pageX;
                    this.pageY = startEvent.pageY;
                }
                Object.defineProperty(MouseMoveInfo.prototype, "offsetX", {
                    get: function () {
                        if (!this.moveEvent)
                            return 0;
                        return this.moveEvent.pageX - this.startEvent.pageX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MouseMoveInfo.prototype, "offsetY", {
                    get: function () {
                        if (!this.moveEvent)
                            return 0;
                        return this.moveEvent.pageY - this.startEvent.pageY;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MouseMoveInfo;
            }());
            Behaviors.MouseMoveInfo = MouseMoveInfo;
        })(Behaviors = FixiGridComponents.Behaviors || (FixiGridComponents.Behaviors = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var Elements;
        (function (Elements) {
            var Game = (function () {
                function Game() {
                }
                Game.render = function (d3svgcontent, games) {
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
                        if (event["button"] != 2)
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
                        data.push(FixiGridUI.Utils.toTimeString(d.from) + " - " + FixiGridUI.Utils.toTimeString(d.to));
                        return data;
                    });
                    descriptionText.exit().remove();
                    descriptionText.enter()
                        .append("text");
                    return game;
                };
                Game.reposition = function (d3svgcontent, scaleY, courtDict) {
                    var game = d3svgcontent.selectAll(".game")
                        .attr({
                        transform: function (d) {
                            return "translate(" + courtDict[d.courtId].position + "," + scaleY(d.from) + ")";
                        }
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
                return Game;
            }());
            Elements.Game = Game;
        })(Elements = FixiGridComponents.Elements || (FixiGridComponents.Elements = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
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
                    $(_this).trigger("ongamechange", {
                        data: data,
                        courtId: data.courtId,
                        from: _this.calibrateDate(_this.scale.y.invert(xy.top)),
                        to: _this.calibrateDate(_this.scale.y.invert(xy.top + xy.height))
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
var FixiGridUI;
(function (FixiGridUI) {
    var FixiGridComponents;
    (function (FixiGridComponents) {
        var FixiGridHeader = (function () {
            function FixiGridHeader(args) {
                var _this = this;
                this.fixiGridSize = {
                    width: 0,
                    height: 0
                };
                this.scale = d3.scale.linear();
                this.courtMetrikRegistry = {};
                this.render = function () {
                    var courtHeaders = _this.countHeader.selectAll("tr").data(_this.headerData);
                    courtHeaders.exit().remove();
                    var courtTypes = courtHeaders.enter()
                        .append("tr")
                        .classed("court-type", true);
                    var court = courtTypes.selectAll("th")
                        .data(function (d) { return d; });
                    court.exit().remove();
                    var countSection = court.enter().append("th")
                        .classed("court", true)
                        .attr({
                        "data-id": function (d) { return d.CourtId; },
                        "colspan": function (d) { return d.ColSpan; },
                        "rowspan": function (d) { return d.RowSpan; },
                        "type": function (d) { return d.Type; }
                    }).text(function (d) { return d.CourtName; });
                };
                this.options = args;
                this.countHeader = args.d3Container.classed("court-header", true);
            }
            Object.defineProperty(FixiGridHeader.prototype, "height", {
                get: function () { return this.courtLevelCount * 30; },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(FixiGridHeader.prototype, "courtLevelCount", {
                get: function () { return this.courts.length; },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(FixiGridHeader.prototype, "sectionWidth", {
                get: function () { return this.scale(1); },
                enumerable: true,
                configurable: true
            });
            FixiGridHeader.prototype.refreshSize = function (config) {
                this.fixiGridSize.width = config.headerWidth;
                this.fixiGridSize.height = config.height;
                this.scale.range([0, config.headerWidth]);
            };
            FixiGridHeader.prototype.setCourts = function (courts) {
                this.originalCourts = courts;
                var groupedByCelSize = FixiGridUI.Utils.groupBy(courts, "ColSpan");
                var max = 0;
                var min = 1000;
                var groupedByCelSizeArray = [];
                for (var i in groupedByCelSize) {
                    max = (max > groupedByCelSize[i].length) ? max : groupedByCelSize[i].length;
                    groupedByCelSizeArray.push(groupedByCelSize[i]);
                    min = (min > parseInt(i)) ? parseInt(i) : min;
                }
                this.scale.domain([0, max]);
                var header = [];
                header.push(this.originalCourts.filter(function (c) { return c.ColSpan == min; }).sort(function (a, b) {
                    if (a.ParentCourtId < b.ParentCourtId)
                        return -1;
                    if (a.ParentCourtId > b.ParentCourtId)
                        return 1;
                    return 0;
                }));
                var length = header[0].length;
                var index = 0;
                var stopper = 0;
                while (length != courts.length || stopper > 10) {
                    var nextLevel = this.originalCourts.filter(function (c) {
                        var isParent;
                        isParent = header[index].filter(function (child) { return child.ParentCourtId == c.CourtId; }).length > 0;
                        return isParent;
                    }).sort(function (a, b) {
                        if (a.CourtId < b.CourtId)
                            return -1;
                        if (a.CourtId > b.CourtId)
                            return 1;
                        return 0;
                    });
                    length += nextLevel.length;
                    header.push(nextLevel);
                    index = header.length - 1;
                    stopper++;
                }
                this.headerData = header;
                this.courts = groupedByCelSizeArray;
                this.render();
            };
            FixiGridHeader.prototype.convertUnitCellToCourt = function (game, unitCell) {
                var currentGameCourt = this.countHeader.select("[data-id='" + game.courtId + "']").data()[0];
                var requiredTypeCourts = this.countHeader.selectAll("[type='" + currentGameCourt.Type + "']").data();
                var requiredIndex = parseInt((unitCell / currentGameCourt.ColSpan).toFixed(0));
                return requiredTypeCourts[requiredIndex];
            };
            return FixiGridHeader;
        }());
        FixiGridComponents.FixiGridHeader = FixiGridHeader;
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
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
var FixiGridUI;
(function (FixiGridUI) {
    var Markup;
    (function (Markup) {
        Markup.grid = '<div style="display:table;width: 100%;height: 100%;" data-role="root">    <div style="background: #fafafa;padding-left:45px;display:table-row;height: 1%;">        <div style="display:table-cell;padding-left: 45px;padding-right: 24px;">            <table class="FixiGridHeader court-header" data-role="header"></table>        </div>    </div>    <div style="display:table-row">        <div style="display:table-cell">            <div style="position:relative; height:100%;width:100%">                <div class="fixiGridContentScroll" style="top:0;">                    <svg shape-rendering="crispEdges" class="fixiGridContent" style="width:100%;" data-role="content"></svg>                </div>            </div>        </div>    </div></div>';
    })(Markup = FixiGridUI.Markup || (FixiGridUI.Markup = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var Markup;
    (function (Markup) {
        Markup.print = '<!DOCTYPE html><html><head>    <meta charset="utf-8" />    <meta name="viewport" content="width=device-width" />    <link href="Scripts/fixi.grid/style/fixiGrid.css" rel="stylesheet" />    <link href="Scripts/fixi.grid/style/fixiGrid.print.css" rel="stylesheet" />    <style>        .fixiGridContentScroll { position: relative; top: 0; }        .hide-onprint{display:none}        g.tick line { stroke: #ddd; stroke-width: 1px; fill: aquamarine; }        .courtAxis g text { text-anchor: start !important; }        #fixiGrid { position: relative !important; width: 1000px !important; border:1px solid #ddd }    </style></head><body>    <div id="fixiGrid">    </div></body></html>';
    })(Markup = FixiGridUI.Markup || (FixiGridUI.Markup = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var Models;
    (function (Models) {
        var Components = (function () {
            function Components(uiMarkup) {
                var _this = this;
                this.uiMarkup = uiMarkup;
                this.header = new FixiGridUI.FixiGridComponents.FixiGridHeader({
                    d3Container: uiMarkup.d3HeaderComponentContainer
                });
                this.timeLine = new FixiGridUI.FixiGridComponents.TimeLine({
                    d3Container: uiMarkup.d3ContentComponentContainer
                });
                this.content = new FixiGridUI.FixiGridComponents.Content({
                    d3Container: uiMarkup.d3TimeLineComponentContainer,
                    scaleX: this.header.scale,
                    scaleY: this.timeLine.scale
                });
                this.content.dragValidation = function (validateGame, rect, courtId) {
                    var from = _this.content.scale.y.invert(rect.top + 5);
                    var to = _this.content.scale.y.invert(rect.top + rect.height - 5);
                    var validateCourt = _this.content.courtDict[courtId];
                    var gamesByCourtPosition = _this.content.games.filter(function (contentGame) {
                        if (validateGame == contentGame)
                            return false;
                        var gameCourt = _this.content.courtDict[contentGame.courtId];
                        return validateCourt.position == gameCourt.position ||
                            (gameCourt.position < validateCourt.position && validateCourt.position + validateCourt.size <= gameCourt.position + gameCourt.size) ||
                            (gameCourt.position > validateCourt.position && validateCourt.position + validateCourt.size >= gameCourt.position + gameCourt.size);
                    });
                    var gamesByTimeRange = gamesByCourtPosition.filter(function (contentGame) {
                        return (from <= contentGame.from && to >= contentGame.from) ||
                            (from <= contentGame.to && to >= contentGame.to) ||
                            (from >= contentGame.from && to <= contentGame.to);
                    });
                    return gamesByTimeRange.length == 0 && validateCourt.type == _this.content.courtDict[validateGame.courtId].type;
                };
            }
            Object.defineProperty(Components.prototype, "onGameClickHandler", {
                set: function (value) {
                    $(this.content).on("ongameclick", value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Components.prototype, "onGameChangeHandler", {
                set: function (value) {
                    $(this.content).on("ongamechange", value);
                },
                enumerable: true,
                configurable: true
            });
            return Components;
        }());
        Models.Components = Components;
    })(Models = FixiGridUI.Models || (FixiGridUI.Models = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var Models;
    (function (Models) {
        var Printer = (function () {
            function Printer(uiMarkup) {
                this.print = function (games, courts, from, to) {
                    setTimeout(function () {
                        var printerFrame = document.createElement('iframe');
                        printerFrame.style.opacity = "0";
                        var printView = $("<html>");
                        printView.html(FixiGridUI.Markup.print);
                        $(window.document.body).append(printerFrame);
                        printerFrame.contentWindow.document.writeln(printView.html());
                        var printGridNode = printerFrame.contentWindow.document.getElementById("fixiGrid");
                        var printGrid = new FixiGridUI.Grid({ id: printGridNode });
                        printGrid.setCourt(courts);
                        printGrid.setTimeRange({ from: from, to: to });
                        printGrid.setData(games);
                        setTimeout(function () {
                            printerFrame.contentDocument.execCommand('print', false, null);
                            printerFrame.parentNode.removeChild(printerFrame);
                        }, 250);
                    }, 200);
                };
                this.uiMarkup = uiMarkup;
            }
            return Printer;
        }());
        Models.Printer = Printer;
    })(Models = FixiGridUI.Models || (FixiGridUI.Models = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var Models;
    (function (Models) {
        var UIMarkup = (function () {
            function UIMarkup(id) {
                this.cssClasses = {
                    header: "fixiGridHeader",
                    content: "fixiGridContent"
                };
                this.config = {
                    width: 0,
                    height: 0,
                    timeLineWidth: 45,
                    headerWidth: 0
                };
                this.$container = $((typeof (id) == "string") ? document.getElementById(id) : id);
                this.$element = this.$container.append(FixiGridUI.Markup.grid);
                this.d3HeaderComponentContainer = this.d3HeaderSelection;
                this.d3ContentComponentContainer = this.d3ContentSelection.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" });
                this.d3TimeLineComponentContainer = this.d3ContentSelection.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" });
            }
            Object.defineProperty(UIMarkup.prototype, "$element", {
                get: function () { return this._$element; },
                set: function (value) {
                    this._$element = value;
                    this.headerNode = FixiGridUI.Utils.getNodesByClassName(this.$element, this.cssClasses.header).item(0);
                    this.d3HeaderSelection = d3.select(this.headerNode);
                    this.contentNode = FixiGridUI.Utils.getNodesByClassName(this.$element, this.cssClasses.content).item(0);
                    this.d3ContentSelection = d3.select(this.contentNode);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIMarkup.prototype, "onPrintClick", {
                set: function (handler) {
                    this.$container.find(".print-button").on("click", function () { return handler(); });
                },
                enumerable: true,
                configurable: true
            });
            UIMarkup.prototype.dispose = function () {
                this.$container.off();
                this.$container.empty();
            };
            UIMarkup.prototype.refreshSizeConfiguration = function () {
                this.config.width = this.$container.width();
                this.config.height = this.$container.height();
                this.config.headerWidth = this.$container.find("[data-role='header']").width();
                return this.config;
            };
            return UIMarkup;
        }());
        Models.UIMarkup = UIMarkup;
    })(Models = FixiGridUI.Models || (FixiGridUI.Models = {}));
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var Grid = (function () {
        function Grid(config) {
            var _this = this;
            this.config = config;
            this.destroy = function () {
                $(window).off("resize.fixiGrid");
                _this.uiMarkup.dispose();
            };
            this.uiMarkup = new FixiGridUI.Models.UIMarkup(config.id);
            this.printer = new FixiGridUI.Models.Printer(this.uiMarkup);
            this.components = new FixiGridUI.Models.Components(this.uiMarkup);
            this.setGameMinTimeRange = config.minGameTimnRange;
            this.resizable = !!config.resizable;
            this.draggable = !!config.draggable;
            this.subscribe();
        }
        Object.defineProperty(Grid.prototype, "draggable", {
            set: function (value) {
                this.components.content.gameDragBehavior.disabled = !value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "resizable", {
            set: function (value) {
                this.components.content.gameResizeDownBehavior.disabled = !value;
                this.components.content.gameResizeTopBehavior.disabled = !value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "setGameMinTimeRange", {
            set: function (value) {
                this.components.content.setGameMinTimeRange(value);
            },
            enumerable: true,
            configurable: true
        });
        Grid.prototype.setData = function (games) {
            this.components.content.render(this.components.header.courts, games);
        };
        Grid.prototype.getData = function () {
            return this.components.content.games;
        };
        Grid.prototype.setCourt = function (courts) {
            this.components.header.setCourts(courts);
            this.refreshSize();
        };
        Grid.prototype.setTimeRange = function (args) {
            this.components.timeLine.setDate(args.from, args.to);
            this.refreshSize();
        };
        Grid.prototype.subscribe = function () {
            var _this = this;
            this.components.onGameClickHandler = function (e, args) {
                switch (args.type) {
                    case "remove":
                        if (_this.config.event && _this.config.event.onRemove)
                            _this.config.event.onRemove(args.data, e);
                        break;
                    case "edit":
                        if (_this.config.event && _this.config.event.onOpen)
                            _this.config.event.onOpen(args.data, e);
                        break;
                    default:
                        break;
                }
                _this.refresh();
            };
            this.components.onGameChangeHandler = function (e, args) {
                var promiseChange = null;
                if (_this.config.event && _this.config.event.onChange)
                    promiseChange = _this.config.event.onChange(args.data, _this.components.header.originalCourts.filter(function (x) { return x.CourtId == args.courtId; })[0], args.from, args.to);
                if (promiseChange)
                    promiseChange.then(function () {
                        _this.refresh();
                    });
                else
                    _this.refresh();
            };
            $(window).on("resize.fixiGrid", function () { _this.refreshSize(); });
        };
        Grid.prototype.refresh = function () {
            this.components.content.render(this.components.header.courts, this.getData());
            this.refreshSize();
        };
        Grid.prototype.refreshSize = function () {
            var newConfig = this.uiMarkup.refreshSizeConfiguration();
            this.components.header.refreshSize(newConfig);
            this.components.timeLine.refreshSize(newConfig);
            this.components.content.reposition();
            this.uiMarkup.d3ContentSelection.attr({ height: this.components.timeLine.scale.range()[1] });
        };
        Grid.prototype.print = function () {
            this.printer.print(this.components.content.games, this.components.header.originalCourts, this.components.timeLine.from, this.components.timeLine.to);
        };
        return Grid;
    }());
    FixiGridUI.Grid = Grid;
})(FixiGridUI || (FixiGridUI = {}));
var FixiGridUI;
(function (FixiGridUI) {
    var Utils;
    (function (Utils) {
        function groupBy(array, field) {
            var dict = {};
            array.forEach(function (item) {
                if (!dict[item[field]])
                    dict[item[field]] = [];
                dict[item[field]].push(item);
            });
            return dict;
        }
        Utils.groupBy = groupBy;
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
        Utils.toTimeString = toTimeString;
        function getNodesByClassName($el, className) {
            return $el.get(0).getElementsByClassName(className);
        }
        Utils.getNodesByClassName = getNodesByClassName;
    })(Utils = FixiGridUI.Utils || (FixiGridUI.Utils = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=fixi.grid.js.map