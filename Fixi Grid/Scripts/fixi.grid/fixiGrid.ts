/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/TimeLine.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
/// <reference path="templates/print.html.ts" />
/// <reference path="models/components.ts" />
/// <reference path="models/printer.ts" />
/// <reference path="models/uimarkup.ts" />
namespace FixiGridUI {
    export class Grid {
        private uiMarkup: Models.UIMarkup;
        private printer: Models.Printer;
        private components: Models.Components;

        constructor(private config: FixiGridOptions) {
            this.uiMarkup = new Models.UIMarkup(config.id);
            this.printer = new Models.Printer(this.uiMarkup);

            this.components = new Models.Components(this.uiMarkup);

            this.subscribe();
        }

        //#region public methods
        public setData(args: { games: FixiGridComponents.FixiCourtGame[] }) {

            this.components.content.render(this.components.header.courts, args.games);
        }

        public setCourt(courts: FixiGridComponents.FixiCourtDB[], from: Date, to: Date) {
            this.components.header.setCourts(courts)
            this.components.timeLine.setDate(from, to)
            this.refreshSize();
        }

        public destroy = () => {
            $(window).off("resize.fixiGrid");
            this.uiMarkup.dispose();
        }
        //#endregion

        //#region private methods
        private subscribe() {
            this.uiMarkup.onPrintClick = () => this.printer.print(this.components.content.games, this.components.header.originalCourts, this.components.timeLine.from, this.components.timeLine.to);

            this.components.onGameClickHandler = (e, args) => {
                switch (args.type) {
                    case "remove":
                        if (this.config.event && this.config.event.onRemove)
                            this.config.event.onRemove(args.data, e)
                        break
                    case "edit":
                        if (this.config.event && this.config.event.onOpen)
                            this.config.event.onOpen(args.data, e)
                        break
                    default:
                        break;
                }

            }
            this.components.onGameChangeHandler = (e, args) => {
                var court: FixiGridComponents.FixiCourtDB = this.components.header.convertUnitCellToCourt(args.data, args.unitCell);

                if (this.config.event && this.config.event.onChange)
                    this.config.event.onChange(args.data, court, args.from, args.to)
            }
            $(window).on("resize.fixiGrid", () => { this.refreshSize() })
        }

        private refreshSize() {
            var newConfig = this.uiMarkup.refreshSizeConfiguration();

            this.components.header.refreshSize(newConfig);
            this.components.timeLine.refreshSize(newConfig);
            this.components.content.reposition();

            this.uiMarkup.d3ContentSelection.attr({ height: this.components.timeLine.scale.range()[1] });
        }
        //#endregion
    }
    export interface FixiGridOptions {
        id: string | Element
        event?: {
            onRemove?: (data: FixiGridComponents.FixiCourtGame, event: any) => void
            onOpen?: (data: FixiGridComponents.FixiCourtGame, event: any) => void
            onChange?: (data: FixiGridComponents.FixiCourtGame, court: FixiGridComponents.FixiCourtDB, from: Date, to: Date) => void
        }
    }
}