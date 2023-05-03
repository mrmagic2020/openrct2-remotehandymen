var subscription : IDisposable;
var subscribed : boolean = false;

export function regCleanPathAction(toggle : boolean) {
  if (toggle && !subscribed) { // enable function
    subscribed = true;
    subscription = context.subscribe("interval.day", () => { // subscribe to day interval
      const handymen = map.getAllEntities("staff").filter(staff => staff.staffType === "handyman"); // filter all handymen on map
      handymen.forEach((handyman, i) => { // iterate through handymen list
        const patrolArea = handyman.patrolArea;
        const issues = map.getAllEntities("litter");
        issues.forEach(issue => { // check if litter entity is within the patrol area of this handyman
          if (patrolArea.contains({x: issue.x, y: issue.y})) {
            issue.remove(); // remove the litter
          }
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
