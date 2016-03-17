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
                return Game;
            }());
            Elements.Game = Game;
        })(Elements = FixiGridComponents.Elements || (FixiGridComponents.Elements = {}));
    })(FixiGridComponents = FixiGridUI.FixiGridComponents || (FixiGridUI.FixiGridComponents = {}));
})(FixiGridUI || (FixiGridUI = {}));
