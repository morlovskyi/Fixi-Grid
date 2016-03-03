/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="components/timeline.ts" />
/// <reference path="components/header.ts" />
/// <reference path="components/content.ts" />
/// <reference path="templates/grid.html.ts" />
class fixiGrid {

    private container: JQuery;
    protected config = {
        width: 0,
        height: 0,
        timeLineWidth: 90
    }
    protected components = {
        header: <fixiGridComponents.fixiGridHeader>null,
        timeLine: <fixiGridComponents.timeLine>null,
        content: <fixiGridComponents.content>null
    }

    public element: JQuery;
    public d3svgheader: d3.Selection<any>;
    public d3svgcontent: d3.Selection<any>;

    constructor(options: fixiGridOptions) {
        this.container = $("#" + options.id);
        this.element = this.container.append(fixiGridTemplates.grid);

        this.d3svgheader = d3.select("#" + options.id + " .fixiGridHeader");
        this.d3svgcontent = d3.select("#" + options.id + " .fixiGridContent");


        this.components.header = new fixiGridComponents.fixiGridHeader({
            d3Container: this.d3svgheader.append("g").attr({ transform: "translate(" + (this.config.timeLineWidth) + "," + 30 + ")" }),
        })

        this.components.timeLine = new fixiGridComponents.timeLine({
            d3Container: this.d3svgcontent.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" }),
        })
        this.components.content = new fixiGridComponents.content({
            d3Container: this.d3svgcontent.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" }),
            scaleX: this.components.header.scale,
            scaleY: this.components.timeLine.scale
        })

        $(this.components.content).on("ongameclick", (e, data, type) => {
            if (type == "remove" && options.event && options.event.onRemove)
                options.event.onRemove(data, e)
            if (type == "edit" && options.event && options.event.onOpen)
                options.event.onOpen(data, e)
        })
        $(this.components.content).on("ongamechange", (e: Event, data: fixiCourtGame, courtId: number, from: Date, to: Date) => {
            if (options.event && options.event.onChange)
                options.event.onChange(data, courtId, from, to)
        })

        $(window).on("resize.fixiGrid", () => { this.refreshSize() })
    }
    public destroy = () => {
        $(window).off("resize.fixiGrid");
        this.container.off("*");
        this.container.empty();
    }
    public setData(args: { games: fixiCourtGame[] }) {
        this.components.content.render(this.components.header.courts, args.games);
    }
    public setCourt(courts: fixiCourtDB[], from: Date, to: Date) {
        this.components.header.setCourts(courts)
        this.components.timeLine.setDate(from, to)
        this.refreshSize();
    }

    private refreshSize() {
        this.config.width = this.container.width() - 25;
        this.config.height = this.container.height();

        this.components.header.refreshSize(this.config.width, this.config.height);
        this.components.timeLine.refreshSize(this.config.width, this.config.height);
        this.components.content.reposition();

        this.d3svgcontent.attr({ height: this.components.timeLine.scale.range()[1] });
    }
}
