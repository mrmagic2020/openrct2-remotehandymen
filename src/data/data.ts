import {
  WritableStore,
  store, twoway
} from "openrct2-flexui"

import {
  regCleanPathAction, setIssueLimit, fetchStaffNameList, fetchStaffIdList
} from "../function/function"

const LOCAL : string = "remotehandymen";
const GLOBAL : string = LOCAL + "_global";

interface DataStructure {
  enabled: {
    readonly key: string;
    readonly global_key: string;
    store: WritableStore<boolean>;
    global_store: WritableStore<boolean>;
    readonly default: boolean
  };
  requirePermission: {
    readonly key: string;
    readonly global_key: string;
    store: WritableStore<boolean>;
    global_store: WritableStore<boolean>;
    readonly default: boolean
  };
  issueLimit: {
    readonly key: string;
    readonly global_key: string;
    store: WritableStore<number>;
    global_store: WritableStore<number>;
    readonly default: number
  };
  chosenHandymanIndex: {
    readonly key: string,
    readonly gobal_key: string,
    store: WritableStore<number>,
    id_store: WritableStore<number>,
    global_store: WritableStore<number>,
    readonly default: number
  }
  useAsGlobal: {
    readonly key: string;
    store: WritableStore<boolean>
  };
  syncToGlobal: {
    readonly key: string;
    store: WritableStore<boolean>
  };
  restoreGlobal: {
    readonly key: string;
    store: WritableStore<boolean>
  };
};

interface StaffList {
  handymen: {
    nameList: WritableStore<string[]>;
    idList: WritableStore<number[]>;
    update: () => void;
  };
}

/**
 * Stores the keys and stores of configurations. 
 * 
 * Items with a `global_` prefix indicates that the item is binded to plugin shared storage. 
 */
export const dataStructure : DataStructure = {
  enabled: {
    key: LOCAL + ".enabled",
    global_key: GLOBAL + ".enabled",
    store: twoway(store<boolean>(context.getParkStorage().get(LOCAL + ".enabled", false))).twoway,
    global_store: store<boolean>(context.sharedStorage.get(GLOBAL + ".enabled", false)),
    default: false
  },
  requirePermission: {
    key: LOCAL + ".requirePermission",
    global_key: GLOBAL + ".requirePermission",
    store: twoway(store<boolean>(context.getParkStorage().get(LOCAL + ".requirePermission", true))).twoway,
    global_store: store<boolean>(context.sharedStorage.get(GLOBAL + ".requirePermission", true)),
    default: true
  },
  issueLimit: {
    key: LOCAL + ".issueLimit",
    global_key: GLOBAL + ".issueLimit",
    store: twoway(store<number>(context.getParkStorage().get(LOCAL + ".issueLimit", 5))).twoway,
    global_store: store<number>(context.sharedStorage.get(GLOBAL + ".issueLimit", 5)),
    default: 5
  },
  chosenHandymanIndex: {
    key: LOCAL + ".chosenHandymanIndex",
    gobal_key: GLOBAL + ".chosenHandymanIndex",
    store: twoway(store<number>(context.getParkStorage().get(LOCAL + ".chosenHandymanIndex", 0))).twoway,
    id_store: store<number>(0),
    global_store: store<number>(context.sharedStorage.get(GLOBAL + ".chosenHandymanIndex", 0)),
    default: 0
  },
  useAsGlobal: { // only available as local
    key: LOCAL + ".useAsGlobal",
    store: store<boolean>(false)
  },
  syncToGlobal: { // only available as local
    key: LOCAL + ".syncToGlobal",
    store: store<boolean>(context.getParkStorage().get(LOCAL + ".syncToGlobal", false))
  },
  restoreGlobal: { // only available as local
    key: LOCAL + ".restoreGlobal",
    store: store<boolean>(false)
  }
};

export const staffList : StaffList = {
  handymen: {
    nameList: store<string[]>(fetchStaffNameList("handyman")),
    idList: store<number[]>(fetchStaffIdList("handyman")),
    update: () => {
      staffList.handymen.nameList.set(fetchStaffNameList("handyman"));
      staffList.handymen.idList.set(fetchStaffIdList("handyman"));
      dataStructure.chosenHandymanIndex.id_store.set(staffList.handymen.idList.get()[dataStructure.chosenHandymanIndex.store.get()]);
    }
  }
}

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

  dataStructure.requirePermission.store.subscribe((value : boolean) => {
    context.getParkStorage().set(dataStructure.requirePermission.key, value);

    if (dataStructure.syncToGlobal.store.get()) { // sync
      dataStructure.requirePermission.global_store.set(value);
    }
  });

  // global
  dataStructure.requirePermission.global_store.subscribe((value : boolean) => {
    context.sharedStorage.set(dataStructure.requirePermission.global_key, value);
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

  dataStructure.chosenHandymanIndex.store.subscribe((value : number) => {
    staffList.handymen.update();
    context.getParkStorage().set(dataStructure.chosenHandymanIndex.key, value);

    if (dataStructure.syncToGlobal.store.get()) { // sync
      dataStructure.chosenHandymanIndex.global_store.set(value);
    }
  });

  // global
  dataStructure.chosenHandymanIndex.global_store.subscribe((value : number) => {
    context.sharedStorage.set(dataStructure.chosenHandymanIndex.gobal_key, value);
  });

  // Global settings button subscription
  dataStructure.useAsGlobal.store.subscribe((_value : boolean) => {
    // Update all local config to shared storage
    context.sharedStorage.set(dataStructure.enabled.global_key, dataStructure.enabled.store.get());
    context.sharedStorage.set(dataStructure.issueLimit.global_key, dataStructure.issueLimit.store.get());
    context.sharedStorage.set(dataStructure.requirePermission.global_key, dataStructure.requirePermission.store.get());
    context.sharedStorage.set(dataStructure.chosenHandymanIndex.gobal_key, dataStructure.chosenHandymanIndex.store.get());
  });

  // Global settings sync toggle subscription
  dataStructure.syncToGlobal.store.subscribe((_value : boolean) => {});

  // Restore subscription
  dataStructure.restoreGlobal.store.subscribe((_value : boolean) => {
    dataStructure.enabled.global_store.set(dataStructure.enabled.default);
    dataStructure.issueLimit.global_store.set(dataStructure.issueLimit.default);
    dataStructure.requirePermission.global_store.set(dataStructure.requirePermission.default);
    dataStructure.chosenHandymanIndex.global_store.set(dataStructure.chosenHandymanIndex.default);
  });
};

/*
export function getStore(key : string) : WritableStore<boolean> {
  return store<boolean>(context.getParkStorage().get(key, false));
}; */
