/// <reference path="d3elements/game.ts" />
namespace FixiGridUI.FixiGridComponents {
    export class Content {
        public d3svgcontent: d3.Selection<any>;
        public scale = {
            x: <d3.scale.Linear<number, number>>null,
            y: <d3.time.Scale<number, number>>null
        }
        private _courtDict: CourtMetrixDictionary = {}
        get courtDict() { return this._courtDict }
        set courtDict(dict) { this._courtDict = dict }

        private _courts: FixiCourtDB[][] = [];
        get courts() { return this._courts; }
        set courts(values) {
            this._courts = values;
            this.gridReposition();
        }
        public gameDragBehavior: Behaviors.GameDragBehavior;
        public gameResizeTopBehavior: Behaviors.GameResizeTopBehavior;
        public gameResizeDownBehavior: Behaviors.GameResizeDownBehavior;

        private _games: FixiCourtGame[] = [];
        get games() { return this._games; }
        set games(games: FixiCourtGame[]) {
            this._games = games;

            var d3Games = Elements.Game.render(this.d3svgcontent, this._games);

            $(d3Games).on("ongameclick", (e, d, type) => {
                $(this).trigger("ongameclick", <GameClickHandlerArgs>{
                    data: d,
                    type: type
                });
            })

            d3Games.selectAll(".game-aria")
                .call(this.gameDragBehavior.behavior);
            d3Games.selectAll(".game-aria-resize-top")
                .call(this.gameResizeTopBehavior.behavior);
            d3Games.selectAll(".game-aria-resize-down")
                .call(this.gameResizeDownBehavior.behavior);
            this.reposition();
        }

        public axis = {
            x: d3.svg.axis(),
            y: d3.svg.axis()
        }

        constructor(args: FixiGridContentArgs) {
            this.d3svgcontent = args.d3Container.classed("games", true);
            this.scale.x = args.scaleX;
            this.scale.y = args.scaleY;

            this.axis.x.orient('top')
                .scale(this.scale.x)
                .tickFormat("");

            this.axis.y.orient('left')
                .scale(this.scale.y)
                .ticks(d3.time.minute, 15)
                .tickFormat("")

            this.gameDragBehavior = new Behaviors.GameDragBehavior(this.axis.y, this.scale.y, () => this.courtDict);
            this.gameResizeTopBehavior = new Behaviors.GameResizeTopBehavior(this.axis.y, this.scale.y, () => this.courtDict);
            this.gameResizeDownBehavior = new Behaviors.GameResizeDownBehavior(this.axis.y, this.scale.y, () => this.courtDict);

            $([this.gameDragBehavior, this.gameResizeTopBehavior, this.gameResizeDownBehavior]).on("change", (e: Event, xy: { top: number, left: number, width: number, height: number }, target: d3.Selection<FixiCourtGame>, data: FixiCourtGame) => {

                $(this).trigger("ongamechange", <GameChangeHandlerArgs>{
                    data: data,
                    unitCell: this.scale.x.invert(xy.left),
                    from: this.scale.y.invert(xy.top),
                    to: this.scale.y.invert(xy.top + xy.height)
                })
            })

            this.gridRender();
        }

        public render(courts: FixiCourtDB[][], games: FixiCourtGame[]) {
            this.courts = courts;
            this.games = games
        }
        public reposition() {
            this.gridReposition();
            Elements.Game.reposition(this.d3svgcontent, this.scale.y, this.courtDict);
        }

        private gridRender() {
            this.d3svgcontent.append("g").classed("axis-x", true)
            this.d3svgcontent.append("g").classed("axis-y", true)
        }

        private gridReposition() {
            this.courtDict = {};
            for (var i = 0, length = this.courts.length; i < length; i++) {
                var type = this.courts[i];
                for (var j = 0, jlength = type.length; j < jlength; j++) {
                    var court = type[j];
                    this.courtDict[court.CourtId] = {
                        color: court.Color,
                        position: this.scale.x(court.ColSpan) * j,
                        size: this.scale.x(court.ColSpan)
                    }
                }
            }


            this.axis.x.tickSize(-this.scale.y.range()[1], 1)

            this.axis.y.tickSize(-this.scale.x.range()[1], 1)

            this.d3svgcontent.select("g.axis-x").call(this.axis.x)
            this.d3svgcontent.select("g.axis-y").call(this.axis.y)
        }
    }
    export interface GameClickHandlerArgs {
        data: FixiCourtGame
        type: "remove" | "edit"
    }
    export interface GameChangeHandlerArgs {
        data: FixiCourtGame
        unitCell: number
        from: Date
        to: Date
    }

    export interface FixiGridContentArgs {
        d3Container: d3.Selection<any>
        scaleX: d3.scale.Linear<number, number>,
        scaleY: d3.time.Scale<number, number>
    }
    export interface FixiCourtGame {
        data: any,
        user: string
        division?: string
        from: Date
        to: Date
        courtId: number
    }
    export interface CourtMetrixDictionary { [id: number]: { size: number, position: number, color: string } }
}