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
        }

        set onGameClickHandler(value: (e: JQueryEventObject, args: FixiGridComponents.GameClickHandlerArgs) => void) {
            $(this.content).on("ongameclick", value)
        }
        set onGameChangeHandler(value: (e: Event, args: FixiGridComponents.GameChangeHandlerArgs) => void) {
            $(this.content).on("ongamechange", value)
        }
    }
}