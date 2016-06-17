
 
 




/// <reference path="Enums.ts" />

declare module Fixi_Grid.Models {
	interface CourtStructure {
		AllowedSports: number[];
		Color: string;
		ColSpan: number;
		CourtId: number;
		CourtName: string;
		ParentCourtId: number;
		RowSpan: number;
		Type: number;
	}
	interface FixiGame {
		CourtId: number;
		Division: string;
		From: Date;
		Id: number;
		SportID: number;
		To: Date;
		User: string;
	}
}


