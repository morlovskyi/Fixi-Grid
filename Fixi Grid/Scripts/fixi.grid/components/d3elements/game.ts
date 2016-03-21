namespace FixiGridUI.FixiGridComponents.Elements {
    export class Game {
        public static render(d3svgcontent: d3.Selection<any>, games: FixiCourtGame[]) {
            var game = d3svgcontent
                .selectAll(".game")
                .data(games)

            game.exit().remove();
            game.enter()
                .append("g")
                .classed("game", true);

            var gameArea = game.selectAll(".game-aria").data(d=> [d])
            gameArea.exit().remove();
            gameArea.enter().append("rect")
                .classed("game-aria", true)
                .on("mouseover", (d, i, y) => {
                    d3.select(event.target).classed("f-hover", true)
                })
                .on("mouseleave", (d, i, y) => {
                    d3.select(event.target).classed("f-hover", false)
                })

            var gameResizeTop = game.selectAll(".game-aria-resize-top").data(d=> [d])
            gameResizeTop.exit().remove();
            gameResizeTop.enter().append("rect")
                .classed("game-aria-resize-top", true)


            var gameResizeDown = game.selectAll(".game-aria-resize-down").data(d=> [d])
            gameResizeTop.exit().remove();
            gameResizeTop.enter().append("rect")
                .classed("game-aria-resize-down", true)


            var gameColor = game.selectAll(".game-color").data(d=> [d])
            gameColor.exit().remove()
            gameColor.enter().append("rect")
                .classed("game-color", true)

            var gameTitle = game.selectAll(".game-title-1").data(d=> [d])
            gameTitle.exit().remove();
            gameTitle.enter().append("g")
                .classed("game-title-1", true)

            var gameTitleText = gameTitle.selectAll(".title").data(d=> [d])
            gameTitleText.exit().remove();
            gameTitleText.enter().append("text")
                .classed("title", true)

            var gameTitleRemoveButton = gameTitle.selectAll(".remove").data(d=> [d])
            gameTitleRemoveButton.exit().remove();
            gameTitleRemoveButton.enter().append("text")
                .classed("remove", true)
                .attr({
                    "data-role": "button"
                })
                .on("click", (d) => {
                    $(game).trigger("ongameclick", [d, "remove"])
                })

            var descriptionGroup = game.selectAll(".description").data(d=> [d])
            descriptionGroup.exit().remove();
            descriptionGroup.enter().append("g")
                .classed("description", true)

            var descriptionText = descriptionGroup.selectAll("text").data(d=> {
                var data = <any>[];
                if (d.division)
                    data.push(d.division);
                data.push(Utils.toTimeString(d.from) + " - " + Utils.toTimeString(d.to))
                return data;
            })

            descriptionText.exit().remove()
            descriptionText.enter()
                .append("text")

            return game;

        }
        public static reposition(d3svgcontent: d3.Selection<any>, scaleY: d3.time.Scale<number, number>, courtDict: CourtMetrixDictionary) {
            var game = d3svgcontent.selectAll(".game")
                .attr({
                    transform: d=> "translate(" + courtDict[d.courtId].position + "," + scaleY(d.from) + ")"
                })

            game.selectAll("rect.game-aria")
                .attr({
                    width: (d) => {
                        return courtDict[d.courtId].size - 4
                    },
                    height: (d) => {
                        return scaleY(d.to) - scaleY(d.from)
                    }
                })
            game.selectAll(".game-aria-resize-top")
                .attr({
                    width: d=> courtDict[d.courtId].size - 4,
                    height: 10,
                })
            game.selectAll(".game-aria-resize-down")
                .attr({
                    width: d=> courtDict[d.courtId].size - 4,
                    height: 10,
                    y: d=> scaleY(d.to) - scaleY(d.from) - 10,
                })
            game.selectAll("rect.game-color")
                .attr({
                    x: (d) => 4,
                    width: 10,
                    y: (d) => 3,
                    height: (d) => scaleY(d.to) - scaleY(d.from) - 5
                })
                .style({
                    fill: d=> courtDict[d.courtId].color
                })

            game.selectAll("text.title")
                .attr({
                    dy: "14px",
                    x: (d) => {
                        return courtDict[d.courtId].size / 2
                    }
                })
                .text(d=> d.user);

            game.selectAll("text.remove")
                .attr({
                    dx: "-15px",
                    dy: 13,
                    x: (d) => {
                        return courtDict[d.courtId].size
                    }
                })
                .text("x")

            game.selectAll(".description")
                .attr({ transform: (d, i) => "translate(" + (courtDict[d.courtId].size / 2) + ",0)" })

            game.selectAll(".description text")
                .attr({
                    dy: 25,
                    dx: 5,
                    transform: (d, i) => "translate(" + 0 + "," + i * 10 + ")"
                })
                .style({
                    "text-anchor": "middle"
                })
                .text(d=> d)
        }
    }
}