export function checkDate(string) {
  // https://regex101.com/r/TDXECk/1
  const regex = /^(((0[1-9]|1[012])[-\/]([012][0-9]|3[012])[-\/]([12][0-9]{3}))|(([012][0-9]|3[012])[-\/](0[1-9]|1[012])[-\/][12][0-9]{3})|(([12][0-9]{3})[-\/](0[1-9]|1[012])[-\/]([012][0-9]|3[012])))($|(\s|[A-Z])(([01][0-9]|2[0-3])(:[0-5][0-9]){2}).[0-9]{3})Z?$/gm

  if(!regex.test(string)) {
    console.log(formatDate(string))
    return regex.test(formatDate(string))
  }
  return regex.test(string)
}

export function csvToJSON (data, delimiter = ',') {
  const csv = data.replace(/"/g, '')
  const titles = csv.slice(0, csv.indexOf('\n')).split(delimiter)
  return csv
    .slice(csv.indexOf('\n')+1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter)
      const json = titles.reduce((obj, title, index) => {
        return (obj[title] = toNumber(values[index])), obj
      } , {})
      
      return json
    })
    
    .filter( (row) => {
      delete row._id
      delete row._index
      delete row._score
      delete row._type
      return row
    }) 
}

export function flattenObj (obj, prefix = '') {
  return Object.keys(obj).map( (row) => row).reduce( (acc, curr) => {
    const pref = prefix.length ? prefix + '_' : ''
    if ( typeof obj[curr] !== 'object' || obj[curr] === null) {
      return  {...acc, ...{ [pref + curr]: obj[curr] }}
    }
    const depth = flatten(obj[curr], pref + curr)
    return { ...acc, ...depth }
  }, {})
}

export function formatDate(str) {
  //date format MMM dd YY
  const regex = /([A-Z a-z]{3})\W+(0?[0-9]|[1-2][0-9]|3[0-1])(\W|,\s)([0-9]{4})((\s\W\s))((?:(0[0-9]|1[0-9]|2[0-3]))(?:(:[0-5][0-9])){2}).([0-9]{3})/gm
  if (str !== undefined)
  return str.replace(regex, ($ ,p1, p2, p3, p4, p5, p6, p7,p8,p9,p10, decal, chaine) => {
    //console.log('date :>> ', `${p4}/${p1}/0${p2} ${p7}`);
    if (p2 < 10 &&  p2.length < 2) 
      return new Date(`${p4}/${p1}/0${p2} ${p7}`).toISOString()
    return new Date(`${p4}/${p1}/${p2} ${p7}`).toISOString()
  })
}

export const MergeObject = (item) => item.reduce( (a, b) => ({ ...a, ...b }) )

export function toNumber(str) {
  const regex = /(\d+|Infinity)/gm
  if( regex.test(str) && isNaN(Number(str)) && typeof str === 'string' ){
    const replacer = str.replace(/,/g, '')
    return Number(replacer)
  }
  return str
}

/**
 * 
 * @param { object } object 
 * @returns If the value of the specified is empty,
 * it will return true.
 */
export function isEmpty( object ) {
  if (
    Array.isArray( object ) ||
    typeof object === 'string' ||
    object instanceof String
  )
    return object.length === 0

  if ( object instanceof Map || object instanceof Set )
    return object.size === 0

  if (({}).toString.call( object ) === '[object Object]')
    return Object.keys( object ).length === 0

  return false
}

export const isOfType = (() => {
  // create a plain object with no prototype
  const type = Object.create( null )

  // check for null type
  type.null = ( x ) => x === null

  // check for undefined type
  type.undefined = ( x ) => x === undefined

  // check for nil type. Either null or undefined
  type.nil = ( x ) => type.null( x ) || type.undefined( x )

  // check for strings and string literal type. e.g: 's', "s", `str`, new String()
  type.string = ( x ) => !type.nil( x ) && ( typeof x === 'string' || x instanceof String )

  // check for number or number literal type. e.g: 12, 30.5, new Number()
  type.number = ( x ) => !type.nil( x ) &&
    ( // NaN & Infinity have typeof "number" and this excludes that
      ( !isNaN( x ) && isFinite( x ) &&
        typeof x === 'number'
      ) || x instanceof Number )
  // check for boolean or boolean literal type. e.g: true, false, new Boolean()
  type.boolean = ( x ) => !type.nil( x ) && ( typeof x === 'boolean' || x instanceof Boolean )

  // check for array type
  type.array = ( x ) => !type.nil( x ) && Array.isArray( x )

  // check for object or object literal type. e.g: {}, new Object(), Object.create( null )
  type.object = ( x ) => ({}).toString.call( x ) === '[object Object]'

  // check for provided type instance
  type.type = ( x, X ) => !type.nil( x ) && x instanceof X

  // check for set type
  type.set = ( x ) => type.type( x, Set )

  // check for map type
  type.map = ( x ) => type.type( x, Map )

  // check for date type
  type.date = ( x ) => type.type( x, Date)

  return type
})()