namespace FixiGridUI.Models {
    export class Printer {
        private uiMarkup: UIMarkup

        constructor(uiMarkup: UIMarkup) {

        }

        public print = () => {
            setTimeout(() => {
                var printerFrame = <HTMLIFrameElement>document.createElement('iframe');// $("<iframe>")[0];
                var printView = $("<html>");
                printView.html(Markup.print);
                printView.find("#fixiGrid").append(this.uiMarkup.$container.clone())

                $(window.document.body).append(printerFrame);
                printerFrame.contentWindow.document.writeln(printView.html())

                setTimeout(() => {
                    printerFrame.contentDocument.execCommand('print', false, null)
                    printerFrame.parentNode.removeChild(printerFrame);
                }, 250)
            }, 200)
        }
    }
}