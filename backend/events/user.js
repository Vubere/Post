const events = require("events");

module.exports = class extends events.EventEmitter {
  static userEvents = {
    created: "user-created",
    deleted: "user-deleted",
    followed: "user-followed",
    unfollowed: "user-unfollowed",
    edited: "user-edited",
  };
  constructor() {
    super();
    this.on(userEvents.created, (userInfo, userId) => {
      console.log("A new user was created!", userInfo?.name, userId);
    });
    this.on(userEvents.deleted, () => {
      console.log("A user was deleted!");
    });
    this.on(userEvents.followed, () => {
      console.log("A user was followed!");
    });
    this.on(userEvents.unfollowed, () => {
      console.log("A user was unfollowed!");
    });
    this.on(userEvents.edited, () => {
      console.log("A new user was edited!");
    });
  }
};
