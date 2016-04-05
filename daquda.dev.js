var daquda = (function(proto) {
  function construct(fields, data) {
    this['data'] = data = data || [];
    this['fields'] = fields;
    this['listeners'] = [];
    for (var i in fields) {
      if (!data[i]) data[i] = [];
    }
  }
  function facade(fields, data) {
    return new construct(fields, data);
  }
  facade['prototype'] = construct['prototype'] = proto;
  return facade;
})({
  //public interface
  'create': function(record) {
    return this['crud'](record);
  },
  'read': function(keyOrRecord) {
    return this['crud']([].concat(keyOrRecord), 1);
  },
  'update': function(record) {
    return this['crud'](record, 2);
  },
  'del': function(keyOrRecord) {
    return this['crud']([].concat(keyOrRecord), 3);
  },

  //core functions
  'crud': function(data, type) {
    //type = create: 0, read: 1, update: 2, delete: 3
    var data = data || [],
      columns = this['data'],
      temp,
      index = -1,
      i;
    if (type && data[0]) {
      index = this['findKey'](data[0]);
    }
    if (!type) {
      index = columns[0].length;
      data[0] = this['newKey']();
    }
    if (index > -1) {
      i = 0;
      temp = columns.length;
      if (type == 3) { //delete
        for (; i < temp; i++) {
          data[i] = columns[i].splice(index, 1)[0];
        }
      } else if (type == 1) { //read
        for (; i < temp; i++) {
          data[i] = columns[i][index];
        }
      } else { //create or update
        for (; i < temp; i++) {
          columns[i][index] = data[i];
        }
      }
      if (type ^ 1) { //if not read, notify listeners about change
        type = type ^ 3 ? type ^ 2 ? 'create' : 'update' : 'delete';
        for (temp in (i = this['listeners'])) {
          i[temp] && i[temp](type, index, data);
        }
      }
      return data;
    }
  },
  'observe': function(fnOrId) {
    var listeners = this['listeners'];
    if (fnOrId in listeners) {
      listeners[fnOrId] = null;
    } else {
      var id = listeners.length;
      listeners[id] = fnOrId;
      return id;
    }
  },
  'findKey': function(key){
    var keycol = this['data'][0], l = keycol.length, i;
    for(i = 0; i < l; i++){
      if(key == keycol[i]) return i;
    }
    return -1;
  },
  'newKey': function() {
    var col = this['data'][0];
    return (col[col.length - 1] || 0) + 1;
  }
});
