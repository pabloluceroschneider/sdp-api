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
    let hh = new Date(ISODate).toLocaleTimeString().split(":")[0];
    let [ yyyy, mm, dd ] = new Date(ISODate).toISOString().slice(0,10).split("-");

    if (hh > 20){
      dd = dd - 1;
    };

    const localDate = [ yyyy, mm, dd ].join("-");
    return localDate + "T";
  }

  getLocalHour(ISODate) {
    let [ hh, mm, ss ] = new Date(ISODate).toLocaleTimeString().split(":");
    
    let hora = hh > 3 ? hh - 3 : (24 + hh) - 3;
    
    if (hora < 10) {
      hora = '0'+ hora;
    }
    if (mm < 10) {
      mm = '0'+ mm;
    }
    if (ss < 10) {
      ss = '0'+ ss;
    }
    
    const segundos =  ss.split(" ")[0];
    const localHour = [ hora, mm, segundos ].join(":");
    
    return localHour + ".000Z";
  }
}

module.exports = LocalDate;
