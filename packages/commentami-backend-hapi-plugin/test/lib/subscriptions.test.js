'use strict'

const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test } = module.exports.lab

const { notifyComment, notifyUser } = require('../../lib/subscriptions')

describe('Subscriptions library', () => {
  describe('notifyComment function', () => {
    test('log when an error happens', async () => {
      let done
      let error
      let errors = 0

      const server = {
        log: (tags, error) => {
          expect(error.message).to.equal('error occurred')
          errors++
          if (errors === 2) return done()
        },
        publishFar: (resource, event) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('error occurred'))
            }, 10)
          })
        }
      }
      const fn = notifyComment.bind(server)

      const p = new Promise((resolve, reject) => {
        done = resolve
        error = reject
      })

      await fn({ id: 1 }, { action: 'add' })
      await p.catch(error)
    })

    test('when no action is provided it returns a resolved promise', async () => {
      const server = {
        log: (tags, error) => {}
      }
      const fn = notifyComment.bind(server)

      await fn({ id: 1 }).then(result => {
        expect(result).to.be.undefined()
      })
    })
  })

  describe('notifyUser function', () => {
    test('log when an error happens', async () => {
      let done
      let error
      let errors = 0
      const resolveUrl = () => 'http://localhost'
      const server = {
        log: (tags, error) => {
          expect(error.message).to.equal('error occurred')
          errors++
          if (errors === 2) return done()
        },
        publishFar: (resource, event) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('error occurred'))
            }, 10)
          })
        },
        commentsService: {
          getInvolvedUsers: () => [{ username: 'davide' }, { username: 'filippo' }]
        }
      }
      const fn = notifyUser.bind(server)

      const p = new Promise((resolve, reject) => {
        done = resolve
        error = reject
      })

      await fn({ id: 1, author: { username: 'paolo' } }, resolveUrl)
      await p.catch(error)
    })
  })
})
