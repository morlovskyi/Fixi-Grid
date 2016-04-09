using Fixi_Grid.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Fixi_Grid.Api
{
    public class FixiDataController : ApiController
    {
        public HttpResponseMessage GetCourtStructure()
        {
            var courts = new List<CourtStructure>() {
                new CourtStructure(){ CourtId= 1, CourtName= "Tennis Court 1", ParentCourtId= 9, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 2, CourtName= "Tennis Court 2", ParentCourtId= 9, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 3, CourtName= "Tennis Court 3", ParentCourtId= 10, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 4, CourtName= "Tennis Court 4", ParentCourtId= 10, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 5, CourtName= "Tennis Court 5", ParentCourtId= 11, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 6, CourtName= "Tennis Court 6", ParentCourtId= 11, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 7, CourtName= "Tennis Court 7", ParentCourtId= 12, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 8, CourtName= "Tennis Court 8", ParentCourtId= 12, ColSpan= 1, RowSpan= 1, Color= "#3333FF" },
                new CourtStructure(){ CourtId= 9, CourtName= "Handball Court 1", ParentCourtId= 13, ColSpan= 2, RowSpan= 1, Color= "#A0DC7F" },
                new CourtStructure(){ CourtId= 10, CourtName= "Handball Court 2", ParentCourtId= 13, ColSpan= 2, RowSpan= 1, Color= "#A0DC7F" },
                new CourtStructure(){ CourtId= 11, CourtName= "Handball Court 3", ParentCourtId= 14, ColSpan= 2, RowSpan= 1, Color= "#A0DC7F" },
                new CourtStructure(){ CourtId= 12, CourtName= "Handball Court 4", ParentCourtId= 14, ColSpan= 2, RowSpan= 1, Color= "#A0DC7F" },
                new CourtStructure(){ CourtId= 13, CourtName= "Football Court 1", ParentCourtId= 0, ColSpan= 4, RowSpan= 1, Color= "white" },
                new CourtStructure(){ CourtId= 14, CourtName= "Football Court 2", ParentCourtId= 0, ColSpan= 4, RowSpan= 1, Color= "white" }
            };

            return Request.CreateResponse<List<CourtStructure>>(HttpStatusCode.OK, courts);
        }
        public HttpResponseMessage GetGames(DateTime businessDate)
        {
            var games = new List<FixiGame>();
            games.Add(new FixiGame() { Id = 1, User = "Tony", From = new DateTime(2016, 5, 5, 10, 30, 0), To = new DateTime(2016, 5, 5, 11, 30, 0), CourtId = 1 });
            games.Add(new FixiGame() { Id = 2, User = "Tony", From = new DateTime(2016, 5, 5, 10, 30, 0), To = new DateTime(2016, 5, 5, 11, 30, 0), CourtId = 2 });
            games.Add(new FixiGame() { Id = 3, User = "Team 18 vs Team 20", Division = "Division A", From = new DateTime(2016, 5, 5, 15, 0, 0), To = new DateTime(2016, 5, 5, 15, 30, 0), CourtId = 1 });
            games.Add(new FixiGame() { Id = 4, User = "Team 16 vs Team 4", From = new DateTime(2016, 6, 5, 15, 0, 0), To = new DateTime(2016, 6, 5, 15, 30, 0), CourtId = 7 });
            games.Add(new FixiGame() { Id = 5, User = "Team 16 vs Team 5", Division = "Division A", From = new DateTime(2016, 6, 5, 15, 0, 0), To = new DateTime(2016, 6, 5, 15, 30, 0), CourtId = 8 });
            games.Add(new FixiGame() { Id = 6, User = "Team E vs Team J", Division = "Division A", From = new DateTime(2016, 6, 5, 15, 30, 0), To = new DateTime(2016, 6, 5, 16, 0, 0), CourtId = 9 });
            games.Add(new FixiGame() { Id = 78, User = "Team D vs Team K", Division = "Division A", From = new DateTime(2016, 7, 5, 15, 30, 0), To = new DateTime(2016, 7, 5, 16, 0, 0), CourtId = 11 });


            return Request.CreateResponse<List<FixiGame>>(HttpStatusCode.OK, games.Where(x => x.From.Date == businessDate.Date).ToList());
        }
    }
}



