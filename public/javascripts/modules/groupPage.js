import { b } from './bling'
import getEvents from './account/eventsList'

const orgaId = b('#orga-id')

// Get events
;(() => {
  const eventsDiv = b('.orga-events#events')
  if (!eventsDiv || !orgaId) return
  getEvents(eventsDiv, orgaId)
})()
;(() => {
  // Add a user request
  if (orgaId && orgaId.value) {
    const userReqBtn = b('#userRequest')
    if (userReqBtn) {
      userReqBtn.on('click', () => {
        window.location = `/organism/${orgaId.value}/community/add`
      })
    }
    const userRemoveReqBtn = b('#userRemoveRequest')
    if (userRemoveReqBtn) {
      userRemoveReqBtn.on('click', () => {
        window.location = `/organism/${orgaId.value}/community/remove`
      })
    }
    // Valid or deny member request
    const adminValidUserReqBtn = b('#acceptUserRequest')
    if (adminValidUserReqBtn) {
      adminValidUserReqBtn.on('click', () => {
        const dataId = adminValidUserReqBtn.getAttribute('data-id')
        window.location = `/organism/${orgaId.value}/community/${dataId}/accept`
      })
    }
    const adminDenyUserReqBtn = b('#denyUserRequest')
    if (adminDenyUserReqBtn) {
      adminDenyUserReqBtn.on('click', () => {
        const dataId = adminDenyUserReqBtn.getAttribute('data-id')
        window.location = `/organism/${orgaId.value}/community/${dataId}/deny`
      })
    }
    const adminGrantUserReqBtn = b('#grantUserRequest')
    if (adminGrantUserReqBtn) {
      adminGrantUserReqBtn.on('click', () => {
        const dataId = adminGrantUserReqBtn.getAttribute('data-id')
        window.location = `/organism/${orgaId.value}/community/${dataId}/grant`
      })
    }

    // Quit the group
    const UserQuitReqBtn = b('#userQuit')
    if (UserQuitReqBtn) {
      UserQuitReqBtn.on('click', () => {
        window.location = `/organism/${orgaId.value}/community/quit`
      })
    }
  }
})()
