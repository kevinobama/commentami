'use strict'

const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const buildServer = require('../lib/server')

describe('Server', () => {
  let server = null
  before(async () => {
    server = await buildServer()
  })

  after(async () => {
    server.stop()
  })

  describe('generic', () => {
    describe('GET /comments/{id}', () => {
      test('it should retrieve a comment', async () => {
        const created = await server.commentsService.add({
          url: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'OLD-AUTHOR'
        })

        const response = await server.inject({
          method: 'GET',
          url: `/comments/${created.id}`
        })

        expect(response.statusCode).to.equal(200)
        const result = JSON.parse(response.payload)

        expect(result).to.equal(created)
      })
    })
  })
})
