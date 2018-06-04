export function CommentsFetchService(baseUrl) {
  const addComment = async (resource, comment) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resource: resource,
        reference: comment.reference.id,
        content: comment.content,
        author: 'An author' // This value should be removed and get directly from the session in the server
      })
    }

    const response = await fetch(`${baseUrl}comments`, options)
    return response.json()
  }

  const removeComment = async (comment) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    await fetch(`${baseUrl}comments/${comment.id}`, options)
  }

  const getComments = async (resource) => {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(`${baseUrl}comments?resource=${resource}`, options)
    return (await response.json()).comments
  }

  return {
    addComment,
    removeComment,
    getComments
  }
}
