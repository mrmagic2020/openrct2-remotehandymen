import {
  onClickMenuItem
} from "./ui/main-ui"

import {
  InitData
} from "./data/data"

export function startup()
{
  InitData();
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem("Remote Handymen", () => onClickMenuItem());
	}
}