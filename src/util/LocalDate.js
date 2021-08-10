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
    const date = new Date(ISODate).toLocaleDateString()
    let [ year, month, dt ] = date.split("-")
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    const localDate = [ year, month, dt ].join("-") + "T"
    return localDate
  }

  getLocalHour(ISODate) {
    let [ hh, mm, ss ] = new Date(ISODate).toLocaleTimeString().split(":");
    if (Number(hh) < 10) {
      hh = '0' + Number(hh);
    }
    if (Number(mm) < 10) {
      console.log('mm :>> ', mm);
      mm = '0' + Number(mm);
    }
    if (Number(ss) < 10) {
      ss = '0' + Number(ss);
    }
    ss = ss + ".000Z";
    const localHour = [ hh, mm, ss ].join(":")
    return localHour
  }
}

module.exports = LocalDate;
