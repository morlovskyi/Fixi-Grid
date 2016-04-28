namespace FixiGridUI.Models {
    export class UIMarkup {
        private cssClasses = {
            header: "fixiGridHeader",
            content: "fixiGridContent"
        }
        public $container: JQuery;

        private _$element: JQuery;
        get $element() { return this._$element }
        set $element(value) {
            this._$element = value

            this.headerNode = Utils.getNodesByClassName(this.$element, this.cssClasses.header).item(0);
            this.d3HeaderSelection = d3.select(this.headerNode);

            this.contentNode = Utils.getNodesByClassName(this.$element, this.cssClasses.content).item(0);
            this.d3ContentSelection = d3.select(this.contentNode);
        }

        public headerNode: Node;
        public d3HeaderSelection: d3.Selection<any>;
        public d3HeaderComponentContainer: d3.Selection<any>;

        public contentNode: Node;
        public d3ContentSelection: d3.Selection<any>;
        public d3ContentComponentContainer: d3.Selection<any>;
        public d3TimeLineComponentContainer: d3.Selection<any>;
        public config: SizeConfiguration = {
            width: 0,
            height: 0,
            timeLineWidth: 45
        }
        set onPrintClick(handler: Function) {
            this.$container.find(".print-button").on("click", () => handler());
        }
        constructor(id: string | Element) {
            this.$container = $((typeof (id) == "string") ? document.getElementById(<string>id) : <Element>id);
            this.$element = this.$container.append(Markup.grid);

            this.d3HeaderComponentContainer = this.d3HeaderSelection
            this.d3ContentComponentContainer = this.d3ContentSelection.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" })
            this.d3TimeLineComponentContainer = this.d3ContentSelection.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" })
        }

        public dispose() {
            this.$container.off();
            this.$container.empty();
        }

        public refreshSizeConfiguration() {
            this.config.width = this.$container.width() - 25;
            this.config.height = this.$container.height();

            return this.config
        }
    }
    export interface SizeConfiguration {
        width: number
        height: number
        timeLineWidth: number
    }
}
