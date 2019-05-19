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
      b('#acceptUserRequest').on('click', () => {
        const dataId = adminValidUserReqBtn.getAttribute('data-id')
        window.location = `/organism/${orgaId.value}/community/${dataId}/accept`
      })
    }
    //bloquer un user
    const adminDenyUserReqBtn = b('#denyUserRequest')
    console.log("b : ", adminDenyUserReqBtn)
    const adminDenyUserReqBtnbb = bb('#denyUserRequest')
    console.log("BB : ", adminDenyUserReqBtnbb)
    if (adminDenyUserReqBtnbb) {
      console.log("Do not pass!")

      adminDenyUserReqBtnbb.forEach(blockbb => {
        blockbb.on('click', () => {
          console.log("i'am button : ",blockbb)
          const dataId = blockbb.getAttribute('data-id')
          console.log("Id n° : ", dataId)
          window.location = `/organism/${orgaId.value}/community/${dataId}/deny`
        })
      });
    }

    //débloquer et mettre en attente 
    const adminGrantUserReqBtn = b('#grantUserRequest')
    if (adminGrantUserReqBtn) {
      b('#grantUserRequest').on('click', () => {
        const dataId = adminGrantUserReqBtn.getAttribute('data-id')
        console.log(dataId)
        window.location = `/organism/${orgaId.value}/community/${dataId}/grant`
      })
    }

    //donner les droits admin
    const adminGiveAdminRightReqBtn = b('#giveAdminRightRequest')
    if(adminGiveAdminRightReqBtn){
      b('#giveAdminRightRequest').on('click', () => {
        const dataId = adminGiveAdminRightReqBtn.getAttribute('data-id')
        console.log(dataId)
        window.location = `/organism/${orgaId.value}/community/${dataId}/giveadminright`
      })
    }

    // retirer les droits admin
    const adminRemoveAdminRightReqBtn = b('.removeAdminRightRequest')
    if(adminRemoveAdminRightReqBtn){
      b('.removeAdminRightRequest').on('click', () => {
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
