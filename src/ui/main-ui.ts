import {
  tabwindow, tab, checkbox, WindowTemplate, label, button, toggle, spinner
} from "openrct2-flexui";

import {
  dataStructure
} from "../data/data"

// Animations
const spiralSlideIcon: ImageAnimation = {
	frameBase: 5442,
	frameCount: 16,
	frameDuration: 4
};
const hangingMechanicIcon: ImageAnimation = {
	frameBase: 11469,
	frameCount: 12,
	frameDuration: 4,
	offset: { x: 21, y: 22 }
};


function onClickMenuItem()
{
  /*
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
  ); */
  const win_desc : WindowTemplate = tabwindow(
    {
      title: "Remote Handymen",
      width: 300,
      height: 200,
      tabs: [
        tab({ // Local config tab
          image: spiralSlideIcon,
          content: [
            label(
              {
                text: "Local Configuration"
              }
            ),
            checkbox(
              {
                text: "Enable Remote Handymen",
                tooltip: "Main switch for the plugin.",
                isChecked: dataStructure.enabled.store.get(),
                onChange: (is) => {
                  dataStructure.enabled.store.set(is);
                }
              }
            ),
            label(
              {
                text: "The maximum amount of path issue a handyman can remotely clear",
                height: "28px"
              }
            ),
            spinner(
              {
                value: dataStructure.issueLimit.store,
                minimum: 0,
                onChange: (num, _adj) => {
                  dataStructure.issueLimit.store.set(num);
                }
              }
            )
          ]
        }),
        tab({
          image: hangingMechanicIcon,
          content: [
            label(
              {
                text: "Global Configuration"
              }
            ),
            button(
              {
                text: "Use current local config as global",
                onClick: () => {
                  dataStructure.useAsGlobal.store.set(!dataStructure.useAsGlobal.store.get());
                }
              }
            ),
            toggle(
              {
                text: "Sync current local config to global",
                isPressed: dataStructure.syncToGlobal.store.get(),
                tooltip: "When toggled, the local config in this scenario play will be synchronized to the global setting, i.e. effects other scenarios.",
                onChange: (is) => {
                  dataStructure.syncToGlobal.store.set(is);
                }
              }
            )
          ]
        })
      ]
    }
  );
  win_desc.open();
}

export { onClickMenuItem };