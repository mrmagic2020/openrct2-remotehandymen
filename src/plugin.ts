/// <reference path="../lib/openrct2.d.ts" />

import { startup } from "./startup";

const NAME : string = "remotehandymen";
const VERS : string = "0.3.0";
registerPlugin({
	name: NAME,
	version: VERS,
	authors: [ "mrmagic2020" ],
	type: "remote",
	licence: "MIT",
	/**
	 * This field determines which OpenRCT2 API version to use. It's best to always use the
	 * latest release version, unless you want to use specific versions from a newer develop
	 * version. Version 70 equals the v0.4.4 release.
	 * @see https://github.com/OpenRCT2/OpenRCT2/blob/v0.4.4/src/openrct2/scripting/ScriptEngine.h#L50
	 */
	targetApiVersion: 77,
  minApiVersion: 34,
	main: startup,
});