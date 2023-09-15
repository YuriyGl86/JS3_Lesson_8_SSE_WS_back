const users = {
  data: ['testUser1', 'testUser2'],
  addListeners: [],
  delListeners: [],

  add(item) {
    this.data.push(item);

    this.addListeners.forEach((handler) => handler(item));
  },

  del(name) {
    this.data = this.data.filter((userName) => userName !== name);

    this.delListeners.forEach((handler) => handler(name));
  },

  listen(handler) {
    this.addListeners.push(handler);
  },

  addDelListener(handler) {
    this.delListeners.push(handler);
  },
};

module.exports = users;
