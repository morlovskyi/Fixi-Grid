namespace FixiGridUI.Models {
    export class Components {
        public header: FixiGridComponents.FixiGridHeader
        public timeLine: FixiGridComponents.TimeLine
        public content: FixiGridComponents.Content
        constructor(private uiMarkup: UIMarkup) {
            this.header = new FixiGridComponents.FixiGridHeader({
                d3Container: uiMarkup.d3HeaderComponentContainer
            })

            this.timeLine = new FixiGridComponents.TimeLine({
                d3Container: uiMarkup.d3ContentComponentContainer
            })
            this.content = new FixiGridComponents.Content({
                d3Container: uiMarkup.d3TimeLineComponentContainer,
                scaleX: this.header.scale,
                scaleY: this.timeLine.scale
            })

            this.content.dragValidation = (validateGame, rect) => {
                var court = this.header.convertUnitCellToCourt(validateGame, this.header.scale.invert(rect.left))
                var from = this.content.scale.y.invert(rect.top + 5);
                var to = this.content.scale.y.invert(rect.top + rect.height - 5);
                if (!court)
                    return false;

                var validateCourt = this.content.courtDict[court.CourtId]

                var gamesByCourtPosition = this.content.games.filter(contentGame => {
                    if (validateGame == contentGame) return false;

                    var gameCourt = this.content.courtDict[contentGame.courtId];

                    return validateCourt.position == gameCourt.position ||
                        (gameCourt.position < validateCourt.position && validateCourt.position + validateCourt.size <= gameCourt.position + gameCourt.size)||
                        (gameCourt.position > validateCourt.position && validateCourt.position + validateCourt.size >= gameCourt.position + gameCourt.size);
                })

                var gamesByTimeRange = gamesByCourtPosition.filter(contentGame => {
                    return (from <= contentGame.from && to >= contentGame.from) ||
                        (from <= contentGame.to && to >= contentGame.to) ||
                        (from >= contentGame.from && to <= contentGame.to)
                })

                
                return gamesByTimeRange.length == 0;
            }
        }

        set onGameClickHandler(value: (e: JQueryEventObject, args: FixiGridComponents.GameClickHandlerArgs) => void) {
            $(this.content).on("ongameclick", value)
        }
        set onGameChangeHandler(value: (e: Event, args: FixiGridComponents.GameChangeHandlerArgs) => void) {
            $(this.content).on("ongamechange", value)
        }
    }
}