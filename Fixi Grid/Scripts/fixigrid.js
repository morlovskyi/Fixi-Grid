$(document).ready(function () {
    var fixiGrid = new FixiGridUI.Grid({
        id: "fixiGridElement",
        minGameTimnRange: 45,
        resizable: true,
        draggable: true,
        event: {
            onRemove: onRemoveGameClick,
            onOpen: onOpenGameClick,
            onChange: onGamaChange
        }
    });
    var businessDate = new Date(2016, 4, 5);
    $("#businessDate").val(moment(businessDate).format("YYYY-MM-DD"));
    $("#businessDate").change(function () {
        businessDate = moment($("#businessDate").val()).toDate();
        setTimeRange();
        fetchGames();
    });
    $("#allowResize").change(function () {
        fixiGrid.resizable = $("#allowResize").prop("checked");
    });
    function onRemoveGameClick(game) {
        if (confirm("Are you sure?")) {
            var games = fixiGrid.getData();
            fixiGrid.setData(games.filter(function (d) { return d.data != game.data; }));
        }
    }
    function onOpenGameClick(game) {
        alert("Edit: " + game.user);
    }
    function onGamaChange(game, court, from, to) {
        return $.ajax({
            url: "api/FixiData/CanChangeCourt",
            data: { gameId: game.data.Id, courtId: court.CourtId }
        }).then(function (can) {
            if (can) {
                game.to = to;
                game.courtId = court.CourtId;
                game.from = from;
            }
        });
        //var originalObject: Fixi_Grid.Models.FixiGame = <Fixi_Grid.Models.FixiGame>game.data;
        //originalObject.
    }
    function fetchCourtStructure() {
        return $.ajax({
            url: "api/FixiData/GetCourtStructure"
        }).then(function (data) {
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
        });
    }
    function fetchGames() {
        $.ajax({
            url: "api/FixiData/GetGames",
            data: { businessDate: moment(businessDate).format("YYYY-MM-DD") }
        }).then(function (games) {
            fixiGrid.setData(games.map(function (g) { return {
                courtId: g.CourtId,
                data: g,
                division: g.Division,
                from: moment(g.From).toDate(),
                to: moment(g.To).toDate(),
                user: g.User
            }; }));
        });
    }
    fetchCourtStructure().then(function () {
        setTimeRange();
        fetchGames();
    });
});
//# sourceMappingURL=fixigrid.js.map