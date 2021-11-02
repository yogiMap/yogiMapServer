const isToday = (timestamp) => {
  const now = Date.now();
  const day = 86400000; // milliseconds in a day
  return now - timestamp < day;
};

module.exports = isToday;
