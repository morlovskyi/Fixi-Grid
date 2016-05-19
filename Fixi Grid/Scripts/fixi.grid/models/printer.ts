
namespace FixiGridUI.Models {
    export class Printer {
        private uiMarkup: UIMarkup

        constructor(uiMarkup: UIMarkup) {
            this.uiMarkup = uiMarkup
        }

        public print = (games: FixiGridComponents.FixiCourtGame[], courts: FixiGridComponents.FixiCourtDB[], from: Date, to: Date) => {
            setTimeout(() => {
                var printerFrame = <HTMLIFrameElement>document.createElement('iframe');// $("<iframe>")[0];
                printerFrame.style.opacity = "0";
                var printView = $("<html>");
                printView.html(Markup.print);
                $(window.document.body).append(printerFrame);
                printerFrame.contentWindow.document.writeln(printView.html())

                var printGridNode = printerFrame.contentWindow.document.getElementById("fixiGrid");

                var printGrid = new FixiGridUI.Grid({ id: printGridNode });

                printGrid.setCourt(courts);
                printGrid.setTimeRange({ from: from, to: to });
                printGrid.setData(games);

                setTimeout(() => {
                    printerFrame.contentDocument.execCommand('print', false, null)
                    printerFrame.parentNode.removeChild(printerFrame);
                }, 250)
            }, 200)
        }
    }
}