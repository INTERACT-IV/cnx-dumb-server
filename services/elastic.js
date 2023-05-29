import { Client } from '@elastic/elasticsearch'

// import { logger } from '../index.js'

const { ELASTIC_URL } = process.env,
      client = ELASTIC_URL ? new Client ({ node: `${ELASTIC_URL}` }) : null

// if ( client !== null ) {
// }
// export default {

//   /**
//    * Return true, if value entered matches an index name
//    * @param {string} index
//    */
//   checkIndices(index) {
//     return client.indices.exists({ index: index })
//     .then( ({ body }) => body )
//     .catch( (err) => log.error(err))
//   },

//   /**
//    * Create specified index in Elasticsearch.
//    */
//   create_index(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { data, index } = req.body

//     if (!index) {
//       log.warning(`Enter index name.`)
//       return res.status(400).json({ reason: `Enter index name.` })
//     }

//     client.bulk({ refresh: true, body: data })
//     .then( (result) => {
//       const { statusCode } = result
//       res.status(statusCode).json({ result })
//     })
//     .catch( (err) => {
//       const { error, status } = err.meta.body
//       log.error([error.type, error.reason].join(', '))
//       return res.status(status).json({ reason: [error.type, error.reason].join(', '), [req.body]: req.body })
//     })
//   },

//   create_index_from_file(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { data, index } = req.body,
//           _index = index.split('.')[0],
//           rows = data.flatMap( (doc) => {
//             return [{
//               index: {
//                 _index: _index,
//                 _id: doc._id,
//               }
//             },
//             doc]
//           })

//     client.indices.create({
//       index: _index,
//       body: {
//         mappings: {
//           properties: {
//             agent_id: {
//               type: 'text'
//             },
//             agent_name: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             },
//             agent_session: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             },
//             attempt_duration: {
//               type: 'integer'
//             },
//             chat_duration: {
//               type: 'integer'
//             },
//             duration: {
//               type: 'integer'
//             },
//             end_cause: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             },
//             end_time: {
//               type: 'date',
//               format: 'MM-dd-yyyy HH:mm:ss.SSS'
//             },
//             id: {
//               type: 'integer',
//             },
//             nb_agent_msg: {
//               type: 'integer',
//             },
//             nb_agents: {
//               type: 'integer',
//             },
//             nb_managed_visitors: {
//               type: 'integer',
//             },
//             nb_visitor_msg: {
//               type: 'integer',
//             },
//             nb_waiting_visitors: {
//               type: 'integer',
//             },
//             project: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             },
//             queue_id: {
//               type: 'integer',
//             },
//             queue_name: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             },
//             session_id: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             },
//             timestamp: {
//               type: 'date',
//               format: 'MM-dd-yyyy HH:mm:ss.SSS'
//             },
//             wait_duration: {
//               type: 'integer',
//             },
//             white_label: {
//               type: 'text',
//               fields: {
//                 keyword: {
//                   type: 'keyword',
//                   ignore_above: 256
//                 }
//               }
//             }
//           }
//         }
//       }
//     }, { ignore: [400] })

//     /* console.log('typeof data :>> ', typeof data);
//     console.log('index.split() :>> ', _index)

//     res.json({rows}) */

//     if (!req.body.index) {
//       log.warning(`Enter index name.`)
//       return res.status(400).json({ reason: `Enter index name.` })
//     }

//     client.bulk({ refresh: true, body: rows })
//     .then( (result) => {
//       const { statusCode } = result
//       res.status(statusCode).json({ result })
//     })
//     .catch( (err) => {
//       const { error, status } = err.meta.body
//       log.error([error.type, error.reason].join(', '))
//       return res.status(status).json({ reason: [error.type, error.reason].join(', '), [req.body]: req.body })
//     })
//   },

//   /**
//    * Create specified index in Elasticsearch.
//    */
//   create_one(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { data, id, index } = req.body

//     if (!index) {
//       log.warning(`Enter index name.`)
//       return res.status(400).json({ reason: `Enter index name.` })
//     }

//     client.create({  body: data, id: id,  index: index, refresh: true })
//     .then( (result) => {
//       const { statusCode } = result
//       res.status(statusCode).json({ result })
//     })
//     .catch( (err) => {
//       const { error, status } = err.meta.body
//       log.error([error.type, error.reason].join(', '))
//       return res.status(status).json({ reason: [error.type, error.reason].join(', ') })
//     })
//   },

//   /**
//    * Delete specified index .
//    * 
//    * @param {string} index A comma-separated list of index names to search;
//    * use _all or empty string to perform the operation on all indices.
//    */
//   delete_index(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { index } = req.body

//     if(!index) {
//       log.warning(`Enter index name.`)
//       return res.status(404).json({ reason: `Enter index name.` })
//     }

//     client.indices.delete({ index })
//     .then( (result) => {
//       const { body, statusCode } = result
//       log.debug(body)
//       return res.status(statusCode).json(body)
//     })
//     .catch( (err) => {
//       const { error, status } = err.meta.body
//       log.error([error.type, error.reason].join(', '))
//       return res.status(status).json({ reason: [error.type, error.reason].join(', ') })
//     })
//   },

//   /**
//    * Delete specified index .
//    * 
//    * @param {string} index A comma-separated list of index names to search;
//    * use _all or empty string to perform the operation on all indices.
//    */
//   deleteById(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { params, body } = req,
//     { id }  = params

//     if(body.index){
//       const { index }  = body

//       return client.delete({
//         index: index,
//         id: id,
//         refresh: true
//       })
//       .then( (data) => {
//         log.debug(data)
//         const { body, statusCode } = data
//         res.status(statusCode).json({ rows: body })
//       })
//       .catch( (err) => {
//         const { meta } = err,
//               { body, statusCode } = meta

//         if (body.error) {
//           const { error } = body,
//           message = [ error.type, error.reason ].join(', ')


//           log.error( message )
//           return res.status(statusCode).json({ message })
//         }
        
        
//         log.error( body)
//         res.status(statusCode).json({ ...body })
//       })
//     }

//     return res.status(400).json({ message: 'Enter an index.'})
//   },

//   /**
//    * Return specified index or list of index. If no index is specified,
//    * it will return first 1000 indexes.
//    * 
//    * @param {string} index A comma-separated list of index names to search;
//    * use _all or empty string to perform the operation on all indices.
//    * 
//    * @param {number} hits Number of hits to return ( from 1 to 1000 max.).
//    */
//   findAll(req, res, {
//     hits = 1000,
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { query } = req

//     if (query.index) {
//       const { index, size }  = query,
//             indexes = (index) ? index.split([',']).map((item) => item.trim()) : '',
//             _index  = indexes ,
//             _size = size || hits

//       return client.search({
//         index: _index,
//         body: {
//           query: {
//             match_all: {}
//           }
//         },
//         size: _size
//       })
//       .then( (data) => {
//         const { body, statusCode } = data,
//               { hits } = body,
//               { total } = hits,
//               rows = hits.hits.map( (index) => index)

//         res.status(statusCode).json({ count: total.value, rows  })
//       })
//       .catch( (err) => {
//         log.error(err)
//         res.json(err)
//       })
//     }
//     return res.status(400).json({ message: 'Enter an index.'})
//   },

//   find(req, res, {
//     hits = 1000,
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { query } = req

//     if (query.index){
//       const { index, key, size, value }  = query,
//           indexes = index.split([',']).map((item) => item.trim()),
//           _index  = indexes || '',
//           _size = size || hits,
//           request = { match: { [key] : value } },
//           _request = ((key && value)  !== undefined) ? request : { match_all: {}}
          
//       return client.search({
//         index: _index,
//         body: {
//           query: _request
//         },
//         size: _size
//       })
//       .then( (data) => {
//         const { body, statusCode } = data,
//               { hits } = body,
//               { total } = hits,
//               rows = hits.hits.map( (index) => index)

//         res.status(statusCode).json({ count: total.value, rows  })
//       })
//       .catch( (err) => {
//         const { meta } = err,
//               { body, statusCode } = meta,
//               { error } = body,
//               context = meta.meta.request.params.body,
//               message = [ error.type, error.reason ].join(', ')
        
        
//         log.error( message, context)
//         res.status(statusCode).json({ message, context })
//       })
//     }
//     return res.status(400).json({ message: 'Enter an index.'})
//   }, 

//   /**
//    * If it exists, will return the item corresponding to the id.
//    * @param {string} index Mandatory. Index in which you want to find a specific item from its id. 
//    * @param {string} id Mandatory. The id item you want to find. 
//    */
//   findById(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {

//     const { params, query } = req,
//           { id }  = params

//     if(query.index){
//       const { index }  = query,
//             indexes = index.split([',']).map((item) => item.trim()) ,
//             _index  = indexes

//       return client.get({
//         index: _index,
//         id: id
//       })
//       .then( (data) => {
//         log.debug(data)
//         const { body, statusCode } = data
//         res.status(statusCode).json({ rows: body })
//       })
//       .catch( (err) => {
//         const { meta } = err,
//               { body, statusCode } = meta

//         if (body.error) {
//           const { error } = body,
//           message = [ error.type, error.reason ].join(', ')

    
//           log.error( message )
//           return res.status(statusCode).json({ message })
//         }
        
        
//         log.error( body)
//         res.status(statusCode).json({ ...body })
//       })
//     }

//     return res.status(400).json({ message: 'Enter an index.'})
//   },
  
//   /**
//    * Update specified index in Elasticsearch.
//    */
//   update_index(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { data, index } = req.body

//     if (!index) {
//       log.warning(`Enter index name.`)
//       return res.status(400).json({ reason: `Enter index name.` })
//     }

//     client.bulk({ refresh: true, body: data, index: index })
//     .then( (result) => {
//       const { body, statusCode } = result,
//             updated = body.items.filter(({ update }) => {
//               if (update.result === 'updated') {
//                 return update
//               }
//             }).map((item) => ({ ...item.update }))
//       res.status(statusCode).json(updated)
//     })
//     .catch( (err) => {
//       res.json({ err })
//     })
//   },
  
//   /**
//    * Update specified index in Elasticsearch.
//    */
//   update_one(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { body, params } = req,
//           { id } = params

//           if(body.data && body.index){
//             const { data, index }  = body
      
//             return client.update({
//               body: {
//                 doc: data
//               },
//               id: id,
//               index: index,
//               refresh: true
//             })
//             .then( (data) => {
//               log.debug(data)
//               const { body, statusCode } = data
//               res.status(statusCode).json({ rows: body })
//             })
//             .catch( (err) => {
//               const { meta } = err,
//                     { body, statusCode } = meta
      
//               if (body.error) {
//                 const { error } = body,
//                 message = [ error.type, error.reason ].join(', ')
      
      
//                 log.error( message )
//                 return res.status(statusCode).json({ message })
//               }
              
              
//               log.error( body)
//               res.status(statusCode).json({ ...body })
//             })
//           }
      
//           return res.status(400).json({ message: 'Enter an index.'})
//   },
  
//   /**
//    * Version specified index in Elasticsearch.
//    */
//   version_index(req, res, {
//     log = logger({ module: ' elastic ' })
//   } = {}) {
//     const { data, index } = req.body

//     if (!index) {
//       log.warning(`Enter index name.`)
//       return res.status(400).json({ reason: `Enter index name.` })
//     }

//     client.bulk({ refresh: true, body: data, index: index })
//     .then( (result) => {
//       const { body, statusCode } = result,
//             updated = body.items.filter(({ index }) => {
//               if (index.result === 'updated') {
//                 return index
//               }
//             }).map((item) => ({ ...item.index }))
//       res.status(statusCode).json(updated)
//     })
//     .catch( (err) => {
//       console.error(err)
//       res.json({ err })
//     })
//   },
// }
