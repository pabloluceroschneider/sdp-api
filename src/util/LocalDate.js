
const LocalDate = (ISODate = new Date().toISOString()) => {
  const phase = -3;

  const [
    local_year,
    month,
    day
  ] = ISODate.split("T")[0].split("-");
  const local_hour = new Date(ISODate).getHours() + phase;
  const local_minutes = new Date(ISODate).getMinutes();
  const local_seconds = new Date(ISODate).getSeconds()

  const local_month = month - 1;
  const local_day = day;
  
  const local_date = new Date(
    local_year,
    local_month,
    local_day,
    local_hour,
    local_minutes,
    local_seconds,
  ).toISOString();
  return new Date(local_date).toISOString();
}

module.exports = {
  LocalDate
};