/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/moment/moment.d.ts" />
var app = angular.module("myApp", ['ngMaterial', 'angularMoment']).config(['$controllerProvider', function ($controllerProvider) {
        $controllerProvider.allowGlobals();
    }]);
var games = [
    { data: { id: 1 }, user: "Tony", from: new Date(new Date().setHours(10, 30, 0, 0)), to: new Date(new Date().setHours(11, 30, 0, 0)), courtId: 1 },
    { data: { id: 2 }, user: "Tony", from: new Date(new Date().setHours(10, 30, 0, 0)), to: new Date(new Date().setHours(11, 30, 0, 0)), courtId: 2 },
    { data: { id: 3 }, user: "Team 18 vs Team 20", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 1 },
    { data: { id: 4 }, user: "Team 17 vs Team 3", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 2 },
    { data: { id: 5 }, user: "Team 15 vs Team 5", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 3 },
    { data: { id: 6 }, user: "Team 19 vs Team 2", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 4 },
    { data: { id: 7 }, user: "Team 13 vs Team 7", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 5 },
    { data: { id: 8 }, user: "Team 12 vs Team 8", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 6 },
    { data: { id: 9 }, user: "Team 11 vs Team 9", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 7 },
    { data: { id: 11 }, user: "Team 16 vs Team 4", division: "Mixed", from: new Date(new Date().setHours(15, 0, 0, 0)), to: new Date(new Date().setHours(15, 30, 0, 0)), courtId: 8 },
    { data: { id: 12 }, user: "Team E vs Team J", division: "Division A", from: new Date(new Date().setHours(15, 30, 0, 0)), to: new Date(new Date().setHours(16, 0, 0, 0)), courtId: 9 },
    { data: { id: 13 }, user: "Team G vs Team H", division: "Division A", from: new Date(new Date().setHours(15, 30, 0, 0)), to: new Date(new Date().setHours(16, 0, 0, 0)), courtId: 10 },
    { data: { id: 14 }, user: "Team 14 vs Team 6", division: "Mixed", from: new Date(new Date().setHours(15, 30, 0, 0)), to: new Date(new Date().setHours(16, 0, 0, 0)), courtId: 6 },
    { data: { id: 25 }, user: "Team B vs Team M", division: "Division A", from: new Date(new Date().setHours(15, 30, 0, 0)), to: new Date(new Date().setHours(16, 0, 0, 0)), courtId: 12 },
    { data: { id: 36 }, user: "Team C vs Team L", division: "Division A", from: new Date(new Date().setHours(16, 0, 0, 0)), to: new Date(new Date().setHours(16, 30, 0, 0)), courtId: 9 },
    { data: { id: 43 }, user: "Team F vs Team I", division: "Division A", from: new Date(new Date().setHours(16, 0, 0, 0)), to: new Date(new Date().setHours(16, 30, 0, 0)), courtId: 10 },
    { data: { id: 78 }, user: "Team D vs Team K", division: "Division A", from: new Date(new Date().setHours(16, 0, 0, 0)), to: new Date(new Date().setHours(16, 30, 0, 0)), courtId: 11 },
    { data: { id: 77 }, user: "Legends Vs Magpies", division: "Division A", from: new Date(new Date().setHours(16, 30, 0, 0)), to: new Date(new Date().setHours(17, 15, 0, 0)), courtId: 13 },
    { data: { id: 76 }, user: "Eagles Vs Top Team", division: "Division A", from: new Date(new Date().setHours(16, 30, 0, 0)), to: new Date(new Date().setHours(17, 15, 0, 0)), courtId: 14 },
    { data: { id: 90 }, user: "Demons Vs Whateva's", division: "Division A", from: new Date(new Date().setHours(17, 15, 0, 0)), to: new Date(new Date().setHours(18, 0, 0, 0)), courtId: 13 },
    { data: { id: 98 }, user: "Game On Vs Rhinos", division: "Division A", from: new Date(new Date().setHours(17, 15, 0, 0)), to: new Date(new Date().setHours(18, 0, 0, 0)), courtId: 14 },
];
var fixiController = (function () {
    function fixiController($scope) {
        var _this = this;
        $scope.title = "Fixi Grid Demo";
        $scope.date = moment();
        this.FixiGrid = new FixiGridUI.Grid({
            id: "fixiGridElement",
            event: {
                onRemove: function (data) {
                    if (confirm("Are you sure?")) {
                        games = games.filter(function (d) { return d.data.id != data.data.id; });
                        _this.fetch();
                    }
                },
                onOpen: function (game) {
                    alert("Edit: " + game.user);
                },
                onChange: function (game, court, from, to) {
                    game.to = to;
                    game.courtId = court.CourtId;
                    game.from = from;
                    _this.fetch();
                }
            }
        });
        $scope.$watch('date', function () {
            _this.FixiGrid.setCourt([
                { CourtId: 1, CourtName: "Tennis Court 1", ParentCourtId: 9, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 2, CourtName: "Tennis Court 2", ParentCourtId: 9, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 3, CourtName: "Tennis Court 3", ParentCourtId: 10, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 4, CourtName: "Tennis Court 4", ParentCourtId: 10, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 5, CourtName: "Tennis Court 5", ParentCourtId: 11, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 6, CourtName: "Tennis Court 6", ParentCourtId: 11, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 7, CourtName: "Tennis Court 7", ParentCourtId: 12, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 8, CourtName: "Tennis Court 8", ParentCourtId: 12, ColSpan: 1, RowSpan: 1, Color: "#3333FF" },
                { CourtId: 9, CourtName: "Handball Court 1", ParentCourtId: 13, ColSpan: 2, RowSpan: 1, Color: "#A0DC7F" },
                { CourtId: 10, CourtName: "Handball Court 2", ParentCourtId: 13, ColSpan: 2, RowSpan: 1, Color: "#A0DC7F" },
                { CourtId: 11, CourtName: "Handball Court 3", ParentCourtId: 14, ColSpan: 2, RowSpan: 1, Color: "#A0DC7F" },
                { CourtId: 12, CourtName: "Handball Court 4", ParentCourtId: 14, ColSpan: 2, RowSpan: 1, Color: "#A0DC7F" },
                { CourtId: 13, CourtName: "Football Court 1", ParentCourtId: 0, ColSpan: 4, RowSpan: 1, Color: "white" },
                { CourtId: 14, CourtName: "Football Court 2", ParentCourtId: 0, ColSpan: 4, RowSpan: 1, Color: "white" }
            ], new Date(new Date().setHours(10, 0, 0, 0)), new Date(new Date().setHours(23, 0, 0, 0)));
            _this.fetch();
        }, true);
    }
    fixiController.prototype.getDataFromApi = function () {
        $.ajax({
            url: "getData",
        }).then(function (result) {
        });
    };
    fixiController.prototype.fetch = function () {
        this.FixiGrid.setData({
            games: games
        });
    };
    return fixiController;
}());
//# sourceMappingURL=fixigrid.js.map