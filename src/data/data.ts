import {
  store, twoway
} from "openrct2-flexui"

import {
  regCleanPathAction, setIssueLimit
} from "../function/function"

const LOCAL : string = "remotehandymen";
const GLOBAL : string = LOCAL + "_global";

/**
 * Stores the keys and stores of configurations. 
 * 
 * Items with a global_ prefix indicates that the item is binded to plugin shared storage. 
 */
export const dataStructure = {
  enabled: {
    key: LOCAL + ".enabled",
    global_key: GLOBAL + ".enabled",
    store: store<boolean>(context.getParkStorage().get(LOCAL + ".enabled", false)),
    global_store: store<boolean>(context.sharedStorage.get(GLOBAL + ".enabled", false))
  },
  issueLimit: {
    key: LOCAL + ".issueLimit",
    global_key: GLOBAL + ".issueLimit",
    store: twoway(store<number>(context.getParkStorage().get(LOCAL + ".issueLimit", 5))).twoway,
    global_store: twoway(store<number>(context.sharedStorage.get(GLOBAL + ".issueLimit", 5))).twoway
  },
  useAsGlobal: { // only available as local
    key: LOCAL + ".useAsGlobal",
    store: store<boolean>(false)
  },
  syncToGlobal: { // only available as local
    key: LOCAL + ".syncToGlobal",
    store: store<boolean>(context.getParkStorage().get(LOCAL + ".syncToGlobal", false))
  }
};

/**
 * Function for store subscription initialisation at plugin startup
 */
export function InitData() : void {
  if (dataStructure.enabled.store.get()) {
    regCleanPathAction(true);
  }

  // Main switch subscription
  dataStructure.enabled.store.subscribe((value : boolean) => {
    context.getParkStorage().set(dataStructure.enabled.key, value);
    regCleanPathAction(value);

    if (dataStructure.syncToGlobal.store.get()) { // sync
      dataStructure.enabled.global_store.set(value);
    }
  });

  // global config subscription
  dataStructure.enabled.global_store.subscribe((value : boolean) => {
    context.sharedStorage.set(dataStructure.enabled.global_key, value);
  });

  dataStructure.issueLimit.store.subscribe((value: number) => {
    context.getParkStorage().set(dataStructure.issueLimit.key, value);
    setIssueLimit(value);

    if (dataStructure.syncToGlobal.store.get()) { // sync
      dataStructure.issueLimit.global_store.set(value);
    }
  });

  // global
  dataStructure.issueLimit.global_store.subscribe((value : number) => {
    context.sharedStorage.set(dataStructure.issueLimit.global_key, value);
  });

  // Global settings button subscription
  dataStructure.useAsGlobal.store.subscribe((_value : boolean) => {
    // Update all local config to shared storage
    context.sharedStorage.set(dataStructure.enabled.global_key, dataStructure.enabled.store.get());
    context.sharedStorage.set(dataStructure.issueLimit.global_key, dataStructure.issueLimit.store.get());
  });

  // Global settings sync toggle subscription
  dataStructure.syncToGlobal.store.subscribe((value : boolean) => {
    if (value) {

    }
  });
};

/*
export function getStore(key : string) : WritableStore<boolean> {
  return store<boolean>(context.getParkStorage().get(key, false));
}; */
