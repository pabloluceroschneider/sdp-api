/**
 * 
 * Cuando trabajamos con ISO Dates, la hora que se 
 * genera no contempla el desfasaje de huso horario 
 * (-3 para argentina). Utilizando esta clase, 
 * podemos obtener la fecha y hora local en formato 
 * ISO y lista para ser insertada en mongo. 
 * 
 * para utilizarla: new LocalDate( $fecha ).date
 * @params Fecha, en formato ISO
 * @returns {Date} Fecha en formato ISO que contempla desfasaje de huso horario.
 */
class LocalDate {
  constructor(ISODate = new Date) {
    this.date = this.transformDate(ISODate);
  }

  transformDate(ISODate) {
    const localDate = this.getLocalDate(ISODate);
    const localHour = this.getLocalHour(ISODate);
    const localDateHour = localDate + localHour
    return localDateHour
  }

  getLocalDate(ISODate) {
    const localDate = new Date(ISODate).toISOString().slice(0,11);
    return localDate;
  }

  getLocalHour(ISODate) {
    new Date(ISODate).toLocaleTimeString()
    let localHour = new Date(ISODate).toLocaleTimeString()
    return localHour + ".000Z"
  }
}

module.exports = LocalDate;
