import { nanoid } from 'nanoid'
import chalk from 'chalk'
import util from 'util'
import Winston from 'winston'

import { isEmpty, isOfType } from './toolkit.js';

const { createLogger, format } = Winston,
      { combine, printf } = format,
      Formatters = {
        console: ({ date, id, level, message, module, time, args }) => {
          return [
            date,
            time,
            id,
            module,
            level,
            message,
            args
          ].join('  ')
        }
      }

export function Now() {
  const [ date, time ] = ( new Date()).toISOString().split( 'T' )
  return { date, time }
}

export default function CreateLogger({ level, path }) {
  let id
  function init( value = nanoid()) {
    if ( id === undefined )
      return value
    return id = value
  }
  id = init()

  function write( type, meta ) {
    return logger[ type ]({ ...meta, id, ...Now() })
  }

  const colors = {
    alert: 'orange',
    emerg: 'orange',
    crit: 'red',
    error: 'red',
    warning: 'yellow',
    notice: 'cyan',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  }

  const levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    http: 5,
    info: 6,
    debug: 7
  }

  const transports = []
  Winston.addColors( colors )

  if ( process.env.NODE_ENV === 'production' ) {
    transports.push(
      new Winston.transports.File({
        filename: `${path}/error.log`,
        format: combine(
          printf( Formatters.console ),
        ),
        level: 'error'
      }),

      new Winston.transports.File({
        filename: `${path}/combined.log`,
        format: combine(
          printf( Formatters.console ),
        ),
        level: level || 'info'
      })

      /* new Winston.transports.MongoDB({
        database: 'server_test',
        filename: `${path}/database.log`,
        format: combine(
          colorize(),
          printf(Formatters.console),
        ),
        level: level || 'silly'
      }) */
    )
  } else {
    transports.push(      
      new Winston.transports.Console({
        format: combine(
          format(( info ) => {
            info.level = info.level.toLocaleUpperCase()
            return info
          })(),
          format(( info ) => {
            if ( isOfType.undefined( info.module )) {
              info.module = ' DUMB '
            }

            if ( !isOfType.undefined( info.module )) {
              info.module = info.module.toLocaleUpperCase()
            }

            return info
          })(),
          format(( info ) => {
            if ( isOfType.array( info.message )) {
              info.message = info.message[ 0 ]
            }
            // if (isOfType.object(info.message)) {
            //   info.message = info.message
            // }
            return info
          })(),
          format(( info ) => {
            if ( isOfType.undefined( info.id )) {
              info.id = id
            }
            if ( isOfType.undefined( info.date ) || isOfType.undefined( info.time )) {
              const [ date, time ] = ( new Date()).toISOString().split( 'T' )
              info.date = date
              info.time = time
            }
            return info
          })(),
          format(( info ) => {
            if ( !isEmpty( info.args ) && !isOfType.undefined( info.args )) {
              info.args = util.formatWithOptions({ colors: true, depth: 10, sorted: true },
                '%O',
                ...info.args
              )
              return info
            }
            return info
          })(),
          format.colorize(),
          format.printf(( info ) => {
            if (!isEmpty( info.args ) && !isOfType.undefined( info.args )) {
              if ( isOfType.object( info.message ))
                return `${ info.date } ${ info.time } - ${ info.id } - [${ chalk.magenta( info.module )}] - ${ info.level } ${ util.inspect( info.message, false, 6, true )} ${ util.inspect( info.args, false, 6, true )}`

              return `${ info.date } ${ info.time } - ${ info.id } - [${ chalk.magenta( info.module )}] - ${ info.level } ${ info.message } ${ info.args }`
            }

            if (isOfType.object(info.message))
              return `${ info.date } ${ info.time } - ${ info.id } - [${ chalk.magenta( info.module )}] - ${ info.level } ${ util.inspect( info.message, false, 6, true )}`

            return `${ info.date } ${ info.time } - ${ info.id } - [${ chalk.magenta( info.module )}] - ${ info.level } ${ info.message }`
          })
        ),
        handleExceptions: true,
        level: level || 'debug'
      })
    )
  }

  const logger = createLogger({
    exitOnError: false, // do not exit on handled exceptions,
    levels,
    transports
  })

  return ( defines ) => {
    return {
      alert( message, ...args ) {
        return write( 'alert', { ...defines, message, args })
      },

      critical( message, ...args ) {
        return write('crit', { ...defines, message, args })
      },

      debug( message, ...args ) {
        return write('debug', { ...defines, message, args })
      },

      emergency( message, ...args ) {
        return write('emerg', { ...defines, message, args })
      },

      error( message, ...args ) {
        return write('error', { ...defines, message, args })
      },

      info( message, ...args ) {
        return write('info', { ...defines, message, args })
      },

      init,

      notice( message, ...args ) {
        return write('notice', { ...defines, message, args })
      },

      warning( message, ...args ) {
        return write('warning', { ...defines, message, args })
      }
    }
  }
}
