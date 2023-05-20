var subscription : IDisposable;
var subscribed : boolean = false;
var issueLimit : number;

/**
 * Set the limit of path issues a handyman can remotely clear
 * @param limit 
 */
export function setIssueLimit(limit : number) {
  issueLimit = limit;
}

/**
 * Register remote path cleaning
 * @param toggle register if true, otherwise unsubscribe
 */
export function regCleanPathAction(toggle : boolean) {
  if (toggle && !subscribed) { // enable function
    subscribed = true;
    subscription = context.subscribe("interval.day", () => { // subscribe to day interval
      const handymen = map.getAllEntities("staff").filter(staff => staff.staffType === "handyman"); // filter all handymen on map
      handymen.forEach((handyman, i) => { // iterate through handymen list
        const patrolArea = handyman.patrolArea;
        const issues = map.getAllEntities("litter");
        let counter : number = 0;
        issues.forEach(issue => { // check if litter entity is within the patrol area of this handyman
          if (counter <= issueLimit && patrolArea.contains({x: issue.x, y: issue.y})) {
            issue.remove(); // remove the litter
          }
          counter ++;
        });
        console.log(`Handyman ${i} Orders: ` + handyman.orders.toString());
      });
    });
    console.log("Subscribed.");
  } else if (subscribed) { // disable function
    subscribed = false;
    subscription.dispose();
    console.log("Unsubscribed.");
  }
};

/**
 * Returns the list of name of specified staff
 * @param type 
 * @returns 
 */
export function fetchStaffNameList(type: StaffType) {
  const handymen = map.getAllEntities("staff").filter(staff => staff.staffType === type);
  const nameList : string[] = [];
  handymen.forEach(handyman => {
    nameList.push(handyman.name);
  });
  return nameList;
}

/**
 * Returns the list of id of specified staff
 * @param type 
 * @returns 
 */
export function fetchStaffIdList(type: StaffType) {
  const handymen = map.getAllEntities("staff").filter(staff => staff.staffType === type);
  const idList : number[] = [];
  handymen.forEach(handyman => {
    if (handyman.id !== null) idList.push(handyman.id);
  });
  return idList;
}
