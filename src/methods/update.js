import kebab from 'decamelize'
import plural from 'pluralize'
import { serialise } from '../util'

/**
 * Update a resource
 * Aliases: `patch`
 * @memberof Kitsu
 * @param {String} model Model to update data in
 * @param {Object} body Data to send in the request
 * @returns {Object} JSON-parsed response
 *
 * @example
 * // Update a user's post (Note: For Kitsu.io, posts cannot be edited 30 minutes after creation)
 * api.update('posts', {
 *   id: '12345678',
 *   content: 'Goodbye World'
 * })
 */
export default async function (model, body) {
  try {
    if (!this.axios.defaults.headers.Authorization) throw new Error('Not logged in')
    if (typeof body.id === 'undefined') throw new Error('Updating a resource requires an ID')
    let { data } = await this.axios.patch(`${plural(kebab(model))}/${body.id}`, {
      data: (await serialise(model, body, 'PATCH')).data,
      headers: this.headers
    })
    return data
  } catch (error) {
    const e = error.response.data
    return e.errors ? e.errors : e
  }
}