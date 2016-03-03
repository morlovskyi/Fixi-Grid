interface fixiCourtSetting {
    courts: fixiGridCourt[],
    structure: courtType[][]
}

interface courtType {
    id: string
    name: string
    part: number
}
interface fixiGridOptions {
    id: string
    event?: {
        onRemove?: (data: fixiCourtGame, event: any) => void
        onOpen?: (data: fixiCourtGame, event: any) => void
        onChange?: (data: fixiCourtGame, court: fixiCourtDB,from: Date, to: Date) => void
    }
}
interface fixiGridCourt {
    id: string
    name: string
}


interface fixiGridHeaderArgs {
    d3Container: d3.Selection<any>
}
interface fixiGridTimeLineArgs {
    d3Container: d3.Selection<any>
}
interface fixiGridContentArgs {
    d3Container: d3.Selection<any>
    scaleX: d3.scale.Linear<number, number>,
    scaleY: d3.time.Scale<number, number>
}

interface fixiCourtGame {
    data: any,
    user: string
    division?: string
    from: Date
    to: Date
    courtId: number
}

interface fixiCourtDB {
    CourtId: number
    CourtName: string
    ParentCourtId: number
    ColSpan: number
    RowSpan: number
    Color: string
}

interface courtMetrixDictionary { [id: number]: { size: number, position: number, color: string } }