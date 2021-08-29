
const LocalDate = (ISODate = new Date().toISOString()) => {
  const phase = -3;

  const [
    local_year,
    month,
    day
  ] = ISODate.split("T")[0].split("-");
  const local_hour = new Date(ISODate).getHours() + phase;
  const local_minutes = new Date(ISODate).getMinutes();

  const local_month = month - 1;
  const local_day = day;
  
  const local_date = new Date(
    local_year,
    local_month,
    local_day,
    local_hour,
    local_minutes
  ).toISOString();
  return local_date
}

module.exports = {
  LocalDate
};