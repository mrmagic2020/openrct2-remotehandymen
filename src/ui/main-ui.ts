import {
  tabwindow, tab, checkbox, WindowTemplate, label, button, toggle, spinner, dropdown, viewport, groupbox
} from "openrct2-flexui";

import {
  dataStructure, staffList
} from "../data/data"

// Animations
const tabOneIcon: ImageAnimation = {
	frameBase: 5442,
	frameCount: 16,
	frameDuration: 4
};
const tabTwoIcon: ImageAnimation = {
	frameBase: 5205,
	frameCount: 16,
	frameDuration: 4
};

let isOpen = false;
function onClickMenuItem()
{
  const win_desc : WindowTemplate = tabwindow(
    {
      title: "Remote Handymen",
      width: 300,
      height: 400,
      tabs: [
        tab({ // Local config tab
          image: tabOneIcon,
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
                isChecked: dataStructure.enabled.store,
                onChange: (is) => {
                  dataStructure.enabled.store.set(is);
                }
              }
            ),
            label(
              {
                text: "The maximum amount of path issue a handyman can \nremotely clear every day",
                height: "25px"
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
            ),
            groupbox(
              {
                text: "Supervisor",
                content: [
                  dropdown(
                    {
                      items: staffList.handymen.nameList,
                      selectedIndex: dataStructure.chosenHandymanIndex.store,
                      autoDisable: "empty",
                      onChange: (index) => {
                        dataStructure.chosenHandymanIndex.store.set(index);
                      }
                    }
                  ),
                  viewport(
                    {
                      target: dataStructure.chosenHandymanIndex.id_store
                    }
                  )
                ],
              }
            )
          ]
        }),
        tab({
          image: tabTwoIcon,
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
            ),
            button(
              {
                text: "{RED}Restore Global Configuration",
                tooltip: "This will restore the global configuration and stop all syncs.",
                onClick: () => {
                  dataStructure.restoreGlobal.store.set(!dataStructure.restoreGlobal.store.get());
                }
              }
            )
          ]
        })
      ],
      onOpen: () => isOpen = true,
      onClose: () => isOpen = false
    }
  );
  if (!isOpen)
    win_desc.open();
  else
    win_desc.focus();
}

export { onClickMenuItem };