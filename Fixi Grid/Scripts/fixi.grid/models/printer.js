var FixiGridUI;
(function (FixiGridUI) {
    var Models;
    (function (Models) {
        var Printer = (function () {
            function Printer(uiMarkup) {
                this.print = function (games, courts, from, to) {
                    setTimeout(function () {
                        var printerFrame = document.createElement('iframe'); // $("<iframe>")[0];
                        var printView = $("<html>");
                        printView.html(FixiGridUI.Markup.print);
                        $(window.document.body).append(printerFrame);
                        printerFrame.contentWindow.document.writeln(printView.html());
                        var printGridNode = printerFrame.contentWindow.document.getElementById("fixiGrid");
                        var printGrid = new FixiGridUI.Grid({ id: printGridNode });
                        printGrid.setCourt(courts);
                        printGrid.setTimeRange({ from: from, to: to });
                        printGrid.setData(games);
                        setTimeout(function () {
                            printerFrame.contentDocument.execCommand('print', false, null);
                            printerFrame.parentNode.removeChild(printerFrame);
                        }, 250);
                    }, 200);
                };
                this.uiMarkup = uiMarkup;
            }
            return Printer;
        }());
        Models.Printer = Printer;
    })(Models = FixiGridUI.Models || (FixiGridUI.Models = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=printer.js.map