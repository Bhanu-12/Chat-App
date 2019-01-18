var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime(),
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}&key=AIzaSyA8onfyjr-mcMXIq1lC3BfPZgSqDcKe8dU`,
    createdAt: new Date().getTime()
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage
};