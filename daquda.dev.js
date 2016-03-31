var daquda = (function(proto) {
  function construct(fields, data) {
    this['data'] = data = data || [];
    this['fields'] = fields;
    this['listeners'] = [];
    for (var i in fields) {
      if (!data[i]) data[i] = [];
    }
  }
  construct['prototype'] = proto;
  return function(fields, data) {
    return new construct(fields, data);
  }
})({
  //public interface
  'create': function(record) {
    return this['crud'](record);
  },
  'read': function(record) {
    return this['crud'](record, 1);
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
      key, keycol = columns[0],
      index = -1,
      i, len = keycol.length;
    if (type && data[0]) {
      key = data[0];
      for (i = 0; i < len; i++) {
        if (keycol[i] == key) {
          index = i;
          break;
        }
      }
    }
    if (!type) {
      index = len;
      data[0] = this['newKey']();
    }
    if (index > -1) {
      i = 0;
      len = columns.length;
      if (type == 3) { //delete
        for (; i < len; i++) {
          data[i] = columns[i].splice(index, 1)[0];
        }
      } else if (type == 1) { //read
        for (; i < len; i++) {
          data[i] = columns[i][index];
        }
      } else { //create or update
        for (; i < len; i++) {
          columns[i][index] = data[i];
        }
      }
      if (type ^ 1) { //if not read, notify listeners about change
        type = type ^ 3 ? type ^ 2 ? 'create' : 'update' : 'delete';
        for (key in (i = this['listeners'])) {
          i[key] && i[key](type, index, data);
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
  'newKey': function() {
    var col = this['data'][0];
    return (col[col.length - 1] || 0) + 1;
  }
})
