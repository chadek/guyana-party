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

    // Valid or deny member request
    const adminValidUserReqBtn = b('#acceptUserRequest')
    if (adminValidUserReqBtn) {
      bb('#acceptUserRequest').on('click', () => {
        const dataId = adminValidUserReqBtn.getAttribute('data-id')
        window.location = `/organism/${orgaId.value}/community/${dataId}/accept`
      })
    }
    //bloquer un user
    const adminDenyUserReqBtn = b('#denyUserRequest')
    if (adminDenyUserReqBtn) {
      bb('#denyUserRequest').on('click', () => {
        const dataId = adminDenyUserReqBtn.getAttribute('data-id')
        window.location = `/organism/${orgaId.value}/community/${dataId}/deny`
      })
    }

    //débloquer et mettre en attente 
    const adminGrantUserReqBtn = b('#grantUserRequest')
    if (adminGrantUserReqBtn) {
      bb('#grantUserRequest').on('click', () => {
        const dataId = adminGrantUserReqBtn.getAttribute('data-id')
        console.log(dataId)
        window.location = `/organism/${orgaId.value}/community/${dataId}/grant`
      })
    }

    const adminGiveAdminRightReqBtn = b('#giveAdminRightRequest')
    if(adminGiveAdminRightReqBtn){
      bb('#giveAdminRightRequest').on('click', () => {
        const dataId = adminGiveAdminRightReqBtn.getAttribute('data-id')
        console.log(dataId)
        window.location = `/organism/${orgaId.value}/community/${dataId}/giveadminright`
      })
    }

    const adminRemoveAdminRightReqBtn = b('.removeAdminRightRequest')
    if(adminRemoveAdminRightReqBtn){
      bb('.removeAdminRightRequest').on('click', () => {
        const dataId = adminRemoveAdminRightReqBtn.getAttribute('data-id')
        console.log(dataId)
        window.location = `/organism/${orgaId.value}/community/${dataId}/removeadminright`
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
