import 'dotenv/config'
// import 'regenerator-runtime'

import chalk from 'chalk'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import FileUpload from 'express-fileupload'
import helmet from 'helmet'

import CreateLogger from './utils/logger.js'

import Config from './config/config.json' assert { type: 'json' }
import { Webhook, Test, TTS } from './routes.js'

const { host, logs, port } = Config,
      {
        HOST,
        npm_package_name,
        npm_package_version,
        PORT
      } = process.env,
      Port = PORT || port,
      Host = HOST || host,
      dumb = express()

const logger = CreateLogger(logs)
const log = logger({ module: ' dumb ' })

dumb.use( helmet())

dumb.use( express.urlencoded({ extended: true }))
dumb.use( express.json())

dumb.use( compression())

dumb.use( cors())
dumb.use( FileUpload())

dumb.use(( req, res, next ) => {
  const { body, method, path, query } = req

  log.notice( `${ method }  ${ path }` )
  log.debug( body )
  log.debug( query )

  res.set({ 'Content-Type': 'application/json' })
  return next()
})


// dumb.use( '/elastic', Elastic(logger) )
// dumb.use( '/test', Test(logger) )
// dumb.use( '/tts', TTS(logger) )
dumb.use( '/', Webhook( logger ))


dumb.get( '/about', ( req, res ) => {
  return res.status( 200 ).json({
    npm_package_name,
    npm_package_version,
    status: 'success'
  })
})

dumb.listen( port, () => {
  log.notice( `${ chalk.green( '✓' )} Dumb Server started on http://${ Host }:${ Port }.` )
  console.log( `${ chalk.green( '✓' )} Dumb Server started on http://${ Host }:${ Port }.` )
  process.send( 'ready' )
})

process.on( 'SIGINT', () => {
  console.log( `Terminating application.` )
  process.exit( 0 );
})
