/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
declare namespace FixiGridUI.FixiGridComponents.Behaviors {
    class BaseDragBehavior {
        behavior: d3.behavior.Drag<FixiCourtGame>;
        protected target: d3.Selection<FixiCourtGame>;
        protected shadow: d3.Selection<FixiCourtGame>;
        protected rect: [number, number];
        protected animatinoDuration: number;
        protected dragStartPageX: number;
        protected dragStartPageY: number;
        protected axisX: d3.svg.Axis;
        protected scaleY: d3.time.Scale<number, number>;
        protected courtDict: () => CourtMetrixDictionary;
        protected gameAria: d3.Selection<any>;
        protected gameAriaHeightOriginal: number;
        protected targetClass: string;
        protected shadowClass: string;
        protected dragged: boolean;
        disabled: boolean;
        minGameTimeRange: number;
        isGamePositionValid: (game: FixiCourtGame, rect: Rect) => boolean;
        constructor(axisX: d3.svg.Axis, scaleY: d3.time.Scale<number, number>, courtDict: () => CourtMetrixDictionary);
        protected dragStart(): void;
        private basedrag(d);
        protected drag(d: FixiCourtGame): void;
        protected dragEnd(d: FixiCourtGame): void;
        protected isNewHeightValidByLimit(newHeight: number): boolean;
        private resetShadow();
        validate(game: FixiCourtGame): boolean;
        protected getRect(): Rect;
    }
    interface Rect {
        left: number;
        top: number;
        width: number;
        height: number;
    }
}
declare namespace FixiGridUI.FixiGridComponents.Behaviors {
    class GameDragBehavior extends BaseDragBehavior {
        protected targetClass: string;
        protected shadowClass: string;
        protected drag(d: FixiCourtGame): void;
    }
}
declare namespace FixiGridUI.FixiGridComponents.Behaviors {
    class GameResizeDownBehavior extends BaseDragBehavior {
        private newGameHeight;
        protected shadowClass: string;
        protected drag(d: FixiCourtGame): void;
        private calculateNewHeight();
    }
}
declare namespace FixiGridUI.FixiGridComponents.Behaviors {
    class GameResizeTopBehavior extends BaseDragBehavior {
        protected shadowClass: string;
        protected drag(d: FixiCourtGame): void;
    }
}
declare namespace FixiGridUI.FixiGridComponents.Elements {
    class Game {
        static render(d3svgcontent: d3.Selection<any>, games: FixiCourtGame[]): d3.selection.Update<FixiCourtGame>;
        static reposition(d3svgcontent: d3.Selection<any>, scaleY: d3.time.Scale<number, number>, courtDict: CourtMetrixDictionary): void;
    }
}
declare namespace FixiGridUI.FixiGridComponents {
    class Content {
        d3svgcontent: d3.Selection<any>;
        scale: {
            x: d3.scale.Linear<number, number>;
            y: d3.time.Scale<number, number>;
        };
        private _courtDict;
        courtDict: CourtMetrixDictionary;
        private _courts;
        courts: FixiCourtDB[][];
        gameDragBehavior: Behaviors.GameDragBehavior;
        gameResizeTopBehavior: Behaviors.GameResizeTopBehavior;
        gameResizeDownBehavior: Behaviors.GameResizeDownBehavior;
        private _games;
        games: FixiCourtGame[];
        axis: {
            x: d3.svg.Axis;
            y: d3.svg.Axis;
        };
        dragValidation: (game: FixiCourtGame, rect: Behaviors.Rect) => boolean;
        constructor(args: FixiGridContentArgs);
        setGameMinTimeRange(value?: number): void;
        render(courts: FixiCourtDB[][], games: FixiCourtGame[]): void;
        reposition(): void;
        private gridRender();
        private gridReposition();
        private calibrateDate(date);
    }
    interface GameClickHandlerArgs {
        data: FixiCourtGame;
        type: "remove" | "edit";
    }
    interface GameChangeHandlerArgs {
        data: FixiCourtGame;
        unitCell: number;
        from: Date;
        to: Date;
    }
    interface FixiGridContentArgs {
        d3Container: d3.Selection<any>;
        scaleX: d3.scale.Linear<number, number>;
        scaleY: d3.time.Scale<number, number>;
    }
    interface FixiCourtGame {
        data: any;
        user: string;
        division?: string;
        from: Date;
        to: Date;
        courtId: number;
    }
    interface CourtMetrixDictionary {
        [id: number]: {
            size: number;
            position: number;
            color: string;
            court: FixiCourtDB;
        };
    }
}
declare namespace FixiGridUI.FixiGridComponents {
    class FixiGridHeader {
        private options;
        originalCourts: FixiCourtDB[];
        private fixiGridSize;
        countHeader: d3.Selection<FixiCourtDB>;
        height: number;
        courtLevelCount: number;
        scale: d3.scale.Linear<number, number>;
        courts: FixiCourtDB[][];
        sectionWidth: number;
        courtMetrikRegistry: any;
        constructor(args: FixiGridHeaderArgs);
        refreshSize(config: Models.SizeConfiguration): void;
        setCourts(courts: FixiCourtDB[]): void;
        render: () => void;
        reposition(): void;
        convertUnitCellToCourt(game: FixiCourtGame, unitCell: number): FixiCourtDB;
    }
    interface FixiGridHeaderArgs {
        d3Container: d3.Selection<any>;
    }
    interface FixiCourtDB {
        CourtId: number;
        CourtName: string;
        ParentCourtId: number;
        ColSpan: number;
        RowSpan: number;
        Color: string;
    }
}
declare namespace FixiGridUI.FixiGridComponents {
    class TimeLine {
        scale: d3.time.Scale<number, number>;
        axis: d3.svg.Axis;
        args: FixiGridTimeLineArgs;
        tickCount: number;
        private fixiGridSize;
        constructor(args: FixiGridTimeLineArgs);
        from: Date;
        to: Date;
        setDate(from: Date, to: Date): void;
        private render();
        refreshSize(config: Models.SizeConfiguration): void;
        reposition(): void;
    }
    interface FixiGridTimeLineArgs {
        d3Container: d3.Selection<any>;
    }
}
declare namespace FixiGridUI.Markup {
    var grid: string;
}
declare namespace FixiGridUI.Markup {
    var print: string;
}
declare namespace FixiGridUI.Models {
    class Components {
        private uiMarkup;
        header: FixiGridComponents.FixiGridHeader;
        timeLine: FixiGridComponents.TimeLine;
        content: FixiGridComponents.Content;
        constructor(uiMarkup: UIMarkup);
        onGameClickHandler: (e: JQueryEventObject, args: FixiGridComponents.GameClickHandlerArgs) => void;
        onGameChangeHandler: (e: Event, args: FixiGridComponents.GameChangeHandlerArgs) => void;
    }
}
declare namespace FixiGridUI.Models {
    class Printer {
        private uiMarkup;
        constructor(uiMarkup: UIMarkup);
        print: (games: FixiGridComponents.FixiCourtGame[], courts: FixiGridComponents.FixiCourtDB[], from: Date, to: Date) => void;
    }
}
declare namespace FixiGridUI.Models {
    class UIMarkup {
        private cssClasses;
        $container: JQuery;
        private _$element;
        $element: JQuery;
        headerNode: Node;
        d3HeaderSelection: d3.Selection<any>;
        d3HeaderComponentContainer: d3.Selection<any>;
        contentNode: Node;
        d3ContentSelection: d3.Selection<any>;
        d3ContentComponentContainer: d3.Selection<any>;
        d3TimeLineComponentContainer: d3.Selection<any>;
        config: SizeConfiguration;
        onPrintClick: Function;
        constructor(id: string | Element);
        dispose(): void;
        refreshSizeConfiguration(): SizeConfiguration;
    }
    interface SizeConfiguration {
        width: number;
        height: number;
        timeLineWidth: number;
    }
}
declare namespace FixiGridUI {
    class Grid {
        private config;
        private uiMarkup;
        private printer;
        private components;
        draggable: boolean;
        resizable: boolean;
        setGameMinTimeRange: number;
        constructor(config: FixiGridOptions);
        setData(games: FixiGridComponents.FixiCourtGame[]): void;
        getData(): FixiGridComponents.FixiCourtGame[];
        setCourt(courts: FixiGridComponents.FixiCourtDB[]): void;
        setTimeRange(args: {
            from: Date;
            to: Date;
        }): void;
        destroy: () => void;
        private subscribe();
        refresh(): void;
        private refreshSize();
        print(): void;
    }
    interface FixiGridOptions {
        id: string | Element;
        minGameTimnRange?: number;
        resizable?: boolean;
        draggable?: boolean;
        event?: {
            onRemove?: (data: FixiGridComponents.FixiCourtGame, event: any) => void;
            onOpen?: (data: FixiGridComponents.FixiCourtGame, event: any) => void;
            onChange?: (data: FixiGridComponents.FixiCourtGame, court: FixiGridComponents.FixiCourtDB, from: Date, to: Date) => void | JQueryPromise<any>;
        };
    }
}
declare namespace FixiGridUI.Utils {
    function groupBy<T>(array: T[], field: string): {
        [key: string]: T[];
    };
    function toTimeString(date: Date): string;
    function getNodesByClassName($el: JQuery, className: string): NodeListOf<Element>;
}
