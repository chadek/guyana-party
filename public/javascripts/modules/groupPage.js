import { b, bb } from './bling'
import getEvents from './account/eventsList'

const groupId = b('#group-id')

// Get events
;(() => {
  const eventsDiv = b('.group-events#events')
  if (!eventsDiv || !groupId) return
  getEvents(eventsDiv, groupId)
})()
;(() => {
  // Add a user request
  if (groupId && groupId.value) {
    // Demande d'adhésion
    const userReqBtn = b('#userRequest')
    if (userReqBtn) {
      userReqBtn.on('click', () => {
        window.location = `/group/${groupId.value}/community/add`
      })
    }
    // Retirer demande d'adhésion
    const userRemoveReqBtn = b('#userRemoveRequest')
    if (userRemoveReqBtn) {
      userRemoveReqBtn.on('click', () => {
        window.location = `/group/${groupId.value}/community/remove`
      })
    }
    // Quit the group
    const UserQuitReqBtn = b('#userQuit')
    if (UserQuitReqBtn) {
      UserQuitReqBtn.on('click', () => {
        window.location = `/group/${groupId.value}/community/quit`
      })
    }

    // ADMIN ACTIONS

    const addClick = (buttons, req) => {
      if (buttons) {
        buttons.forEach(btn => {
          btn.on('click', () => {
            const dataId = btn.getAttribute('data-id')
            window.location = `/group/${
              groupId.value
            }/community/${dataId}/${req}`
          })
        })
      }
    }

    // Valid or deny member request
    addClick(bb('.acceptUserRequest'), 'accept')

    // bloquer un user
    addClick(bb('.denyUserRequest'), 'deny')

    // débloquer et mettre en attente
    addClick(bb('.grantUserRequest'), 'grant')

    // donner les droits admin
    addClick(bb('.giveAdminRightRequest'), 'giveadminright')

    // retirer les droits admin
    addClick(bb('.removeAdminRightRequest'), 'removeadminright')
  }
})()
