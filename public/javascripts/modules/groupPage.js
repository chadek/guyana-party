import { b, bb } from './bling'
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
    //demande d'adhésion
    const userReqBtn = b('#userRequest')
    if (userReqBtn) {
      userReqBtn.on('click', () => {
        window.location = `/organism/${orgaId.value}/community/add`
      })
    }
    // retirer demande d'adhésion
    const userRemoveReqBtn = b('#userRemoveRequest')
    if (userRemoveReqBtn) {
      userRemoveReqBtn.on('click', () => {
        window.location = `/organism/${orgaId.value}/community/remove`
      })
    }

    // Quit the group
    const UserQuitReqBtn = b('#userQuit')
    if (UserQuitReqBtn) {
      UserQuitReqBtn.on('click', () => {
        window.location = `/organism/${orgaId.value}/community/quit`
      })
    }
    // ADMIN ACTIONS

    const addClick = (buttons, req) => {
      if (buttons) {
        buttons.forEach(btn => {
          btn.on('click', () => {
            const dataId = btn.getAttribute('data-id')
            window.location = `/organism/${orgaId.value}/community/${dataId}/${req}`
          })
        });
      }
    }

    // Valid or deny member request
    addClick(bb('.acceptUserRequest'), 'accept')

    //bloquer un user
    addClick(bb('.denyUserRequest'), 'deny')

    //débloquer et mettre en attente 
    addClick(bb('.grantUserRequest'), 'grant')

    //donner les droits admin
    addClick(bb('.giveAdminRightRequest'), 'giveadminright')

    // retirer les droits admin
    addClick(bb('.removeAdminRightRequest'), 'removeadminright')
  }
})()