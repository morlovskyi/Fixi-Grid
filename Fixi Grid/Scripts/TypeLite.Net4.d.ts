
 
 




/// <reference path="Enums.ts" />

declare module Fixi_Grid.Models {
	interface CourtStructure {
		Color: string;
		ColSpan: number;
		CourtId: number;
		CourtName: string;
		ParentCourtId: number;
		RowSpan: number;
	}
	interface FixiGame {
		CourtId: number;
		Division: string;
		From: Date;
		Id: number;
		To: Date;
		User: string;
	}
}


