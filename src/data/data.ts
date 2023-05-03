import {
  store
} from "openrct2-flexui"

const NAME : string = "remotehandymen";

// define JSON keys for easy reference and edit
export const dataStructure = {
  enabled: {
    key: NAME + ".enabled",
    store: store<boolean>(context.getParkStorage().get(NAME + ".enabled", false)),
  }
};

/**
 * Function for store subscription initialisation at plugin startup
 */
export function InitData() : void {
  dataStructure.enabled.store.subscribe((value : boolean) => {
    context.getParkStorage().set(dataStructure.enabled.key, value);
  });
};

/*
export function getStore(key : string) : WritableStore<boolean> {
  return store<boolean>(context.getParkStorage().get(key, false));
}; */