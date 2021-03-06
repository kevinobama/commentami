'use strict'

const Nes = require('nes')
const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments REST API', () => {
  let server = null

  before(async () => {
    await resetDb()
    server = await buildServer({
      port: 8281,
      host: '127.0.0.1',
      auth: true,
      pluginOptions: {
        nes: {
          auth: {
            route: 'myauth'
          }
        },
        multines: {},
        routes: {
          auth: 'myauth',
          getUserFromRequest: async (request, payload) => {
            let user = request.auth.credentials
            return user
          }
        }
      }
    })
    await server.start()
  })

  after(async () => {
    return server.stop()
  })

  describe('GET /comments-references/{resource}', () => {
    test('it should return 401 when not providing an authorization header', async () => {
      const client = new Nes.Client('ws://127.0.0.1:8281')

      try {
        await client.connect()

        throw new Error('We should get an error when requesting a protected resource')
      } catch (e) {
        expect(e.message).to.equal('Connection requires authentication')
      }

      await client.disconnect()
    })

    test('it should return the list of references when providing an authorization header', async () => {
      const client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect({ auth: { headers: { authorization: 'Custom john' } } })

      const response = await client.request('/comments-references/abc')
      const payload = response.payload

      expect(payload).to.equal({ resource: 'abc', references: [] })

      await client.disconnect()
    })
  })

  describe('POST /comments', () => {
    test('it should create a comment', async () => {
      const client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect({ auth: { headers: { authorization: 'Custom john' } } })

      const response = await client.request({
        method: 'POST',
        path: '/comments',
        payload: {
          resource: 'URL',
          reference: 'UUID',
          content: 'MESSAGE'
        }
      })

      expect(response.payload).to.include({
        resource: 'URL',
        reference: 'UUID',
        content: 'MESSAGE',
        author: { username: 'test' }
      })

      await client.disconnect()
    })
  })
})
