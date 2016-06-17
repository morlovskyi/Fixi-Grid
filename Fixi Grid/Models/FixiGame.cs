using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TypeLite;

namespace Fixi_Grid.Models
{
    [TsClass]
    public class FixiGame
    {
        public int Id { get; set; }
        public string User { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public int CourtId { get; set; }
        public string Division { get; set; }
        public int SportID { get; internal set; }
    }
}

