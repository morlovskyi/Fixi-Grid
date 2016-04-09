using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TypeLite;

namespace Fixi_Grid.Models
{
    [TsClass]
    public class CourtStructure
    {
        public int CourtId { get; set; }
        public string CourtName { get; set; }
        public int ParentCourtId { get; set; }
        public int ColSpan { get; set; }
        public int RowSpan { get; set; }
        public string Color { get; set; }
    }
}
