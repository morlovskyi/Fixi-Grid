/// <reference path="d3elements/game.ts" />
namespace fixiGridComponents {
    export class content {
        public d3svgcontent: d3.Selection<any>;
        public scale = {
            x: <d3.scale.Linear<number, number>>null,
            y: <d3.time.Scale<number, number>>null
        }
        private _courtDict: courtMetrixDictionary = {}
        get courtDict() { return this._courtDict }
        set courtDict(dict) { this._courtDict = dict }

        private _courts: fixiCourtDB[][] = [];
        get courts() { return this._courts; }
        set courts(values) {
            this._courts = values;
            this.gridReposition();
        }
        public gameDragBehavior: behaviors.gameDragBehavior;
        public gameResizeTopBehavior: behaviors.gameResizeTopBehavior;
        public gameResizeDownBehavior: behaviors.gameResizeDownBehavior;
        
        private _games: fixiCourtGame[] = [];
        get games() { return this._games; }
        set games(games: fixiCourtGame[]) {
            this._games = games;

            var d3Games = elements.game.render(this.d3svgcontent, this._games);

            $(d3Games).on("ongameclick", (e, d, type) => {
                $(this).trigger("ongameclick", [d, type]);
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

        constructor(args: fixiGridContentArgs) {
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

            this.gameDragBehavior = new behaviors.gameDragBehavior(this.axis.y, this.scale.y, () => this.courtDict);
            this.gameResizeTopBehavior = new behaviors.gameResizeTopBehavior(this.axis.y, this.scale.y, () => this.courtDict);
            this.gameResizeDownBehavior = new behaviors.gameResizeDownBehavior(this.axis.y, this.scale.y, () => this.courtDict);

            $([this.gameDragBehavior, this.gameResizeTopBehavior, this.gameResizeDownBehavior]).on("change", (e: Event, xy: { top: number, left: number, width: number, height: number }, target: d3.Selection<fixiCourtGame>, data: fixiCourtGame) => {
                var unitCell = this.scale.x.invert(xy.left);
                var from = this.scale.y.invert(xy.top);
                var to = this.scale.y.invert(xy.top + xy.height);

                $(this).trigger("ongamechange", [data, unitCell, from, to])
            })

            this.gridRender();
        }

        public render(courts: fixiCourtDB[][], games: fixiCourtGame[]) {
            this.courts = courts;
            this.games = games
        }
        public reposition() {
            this.gridReposition();
            elements.game.reposition(this.d3svgcontent, this.scale.y, this.courtDict);
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
}