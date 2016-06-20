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
                this.content.dragValidation = function (validateGame, rect) {
                    //var court = this.header.convertUnitCellToCourt(validateGame, this.header.scale.invert(rect.left))
                    var from = _this.content.scale.y.invert(rect.top + 5);
                    var to = _this.content.scale.y.invert(rect.top + rect.height - 5);
                    //if (!court)
                    //    return false;
                    var validateCourt = _this.content.courtDict[validateGame.courtId];
                    var gamesByCourtPosition = _this.content.games.filter(function (contentGame) {
                        if (validateGame == contentGame)
                            return false;
                        var gameCourt = _this.content.courtDict[contentGame.courtId];
                        return validateCourt.position == gameCourt.position ||
                            (gameCourt.position < validateCourt.position && validateCourt.position + validateCourt.size <= gameCourt.position + gameCourt.size) ||
                            (gameCourt.position > validateCourt.position && validateCourt.position + validateCourt.size >= gameCourt.position + gameCourt.size);
                        // validateCourt.type == gameCourt.type
                    });
                    var gamesByTimeRange = gamesByCourtPosition.filter(function (contentGame) {
                        return (from <= contentGame.from && to >= contentGame.from) ||
                            (from <= contentGame.to && to >= contentGame.to) ||
                            (from >= contentGame.from && to <= contentGame.to);
                    });
                    return gamesByTimeRange.length == 0;
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
//# sourceMappingURL=components.js.map