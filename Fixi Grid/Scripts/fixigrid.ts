$(document).ready(() => {
    var fixiGrid = new FixiGridUI.Grid({
        id: "fixiGridElement",
        minGameTimnRange: 45,
        event: {
            onRemove: onRemoveGameClick,
            onOpen: onOpenGameClick,
            onChange: onGamaChange
        }
    })

    var businessDate = new Date(2016, 4, 5);

    $("#businessDate").val(moment(businessDate).format("YYYY-MM-DD"))
    $("#businessDate").change(() => {
        businessDate = moment($("#businessDate").val()).toDate();
        setTimeRange();
        fetchGames();
    })

    function onRemoveGameClick(game: FixiGridUI.FixiGridComponents.FixiCourtGame) {
        if (confirm("Are you sure?")) {
            var games = fixiGrid.getData();
            fixiGrid.setData(games.filter(d => d.data != game.data));
        }
    }
    function onOpenGameClick(game: FixiGridUI.FixiGridComponents.FixiCourtGame) {
        alert("Edit: " + game.user)
    }
    function onGamaChange(game: FixiGridUI.FixiGridComponents.FixiCourtGame, court: FixiGridUI.FixiGridComponents.FixiCourtDB, from: Date, to: Date) {
        //$.ajax({
        //    url: "SomeUrlForSavingData",
        //    type: "POST",
        //    data: {

        //    }
        //})

        game.to = to;
        game.courtId = court.CourtId;
        game.from = from


        //var originalObject: Fixi_Grid.Models.FixiGame = <Fixi_Grid.Models.FixiGame>game.data;
        //originalObject.
    }


    function fetchCourtStructure() {
        return $.ajax({
            url: "api/FixiData/GetCourtStructure"
        }).then((data: Fixi_Grid.Models.CourtStructure[]) => {
            fixiGrid.setCourt(data);
        });
    }

    function setTimeRange() {
        var date = businessDate;
        var from = new Date(date.getTime());
        from.setHours(10, 0, 0);
        var to = new Date(date.getTime());
        to.setHours(23, 0, 0);

        fixiGrid.setTimeRange({
            from: from,
            to: to
        })
    }
    function fetchGames() {
        $.ajax({
            url: "api/FixiData/GetGames",
            data: { businessDate: moment(businessDate).format("YYYY-MM-DD") }
        }).then((games: Fixi_Grid.Models.FixiGame[]) => {
            fixiGrid.setData(games.map(g => <FixiGridUI.FixiGridComponents.FixiCourtGame>{
                courtId: g.CourtId,
                data: g,
                division: g.Division,
                from: moment(g.From).toDate(),
                to: moment(g.To).toDate(),
                user: g.User
            }))
        })
    }

    fetchCourtStructure().then(() => {
        setTimeRange();
        fetchGames()
    });
})
