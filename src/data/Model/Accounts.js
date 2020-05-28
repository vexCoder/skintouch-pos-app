export default class Accounts {
  constructor(data) {
    this.uid = data.uid;
    this.username = data.username;
    this.password = data.password;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.created = data.created;
    this.lastModified = data.lastModified;
  }
}
