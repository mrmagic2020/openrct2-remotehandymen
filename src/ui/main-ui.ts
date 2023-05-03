import {
  window, checkbox, WindowTemplate
} from "openrct2-flexui";

import {
  dataStructure
} from "../data/data"

function onClickMenuItem()
{
  const win_desc : WindowTemplate = window(
    {
      title: "Remote Handymen",
      width: 300,
      height: 100,
      content: [
        checkbox(
          {
            text: "Enable Remote Handymen",
            tooltip: "Main switch for the plugin.",
            isChecked: dataStructure.enabled.store.get(),
            onChange: (is) => {
              dataStructure.enabled.store.set(is);
            }
          }
        )
      ]
    }
  );
  win_desc.open();
}

export { onClickMenuItem };