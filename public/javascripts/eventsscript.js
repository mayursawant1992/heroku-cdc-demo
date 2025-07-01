console.log('hello, I am the events page');
let pinger;

const HOST = location.href.replace(/^http/, 'ws');

const ws = new WebSocket(HOST);

var app = new Vue({
    el: '#app',
    data: {
      messages: []
    }
});

ws.onopen = function () {
  console.log('WS is open!');
  pinger = setInterval(() => {
    ws.send('ping');
  }, 5000);
};
  
ws.onclose = function () {
  console.log('WS is closing');
  clearInterval(pinger);
};
  
ws.onmessage = function (event) {
  // console.log(event.data);
  const newData = JSON.parse(event.data).payload;
  console.log(newData);
  //app.messages.push(newData);
  if (app.messages.find( msg => {
    return msg.ChangeEventHeader.sequenceNumber + msg.ChangeEventHeader.transactionKey === newData.ChangeEventHeader.sequenceNumber + newData.ChangeEventHeader.transactionKey
  })) {
    console.log('duplicate found');
  } else {
    const parsed = JSON.parse(newData);
    // Initialize an empty array to hold field-value pairs
    const changedFieldsWithValues = [];
    // Extract list of changed fields from the ChangeEventHeader
    const changedFields = parsed.ChangeEventHeader.changedFields; 
    // Iterate through changed fields and extract their new values
    changedFields.forEach(field => {
      const value = parsed[field]; // direct key lookup
      changedFieldsWithValues.push({ field, value });
    });
    console.log(changedFieldsWithValues);
    app.messages.push(changedFieldsWithValues);
  }
};

const logout = () => {    
  jsforce.browser.logout();
  window.location.href = '/logout';
}
