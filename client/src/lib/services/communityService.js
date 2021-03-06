import { navigate } from 'gatsby'
import { axiosPut, reload, getUID, toast } from '../utils'

export const confirmMember = (community, role) => {
  const uid = getUID()
  if (!uid || !community) return false
  if (role) return undefined !== community.find(o => o.user._id === uid && o.role === role)
  return undefined !== community.find(o => o.user._id === uid)
}

export const isAdmin = community => confirmMember(community, 'admin')

export const isMember = community => confirmMember(community, 'member')

export const countAdmins = community => community.filter(o => o.role === 'admin').length

const getUserId = slug => {
  const uid = getUID()
  if (!uid) {
    toast("Veuillez vous connecter pour faire votre demande d'adhésion")
    navigate(`/connexion?redirect=/group/${slug}`)
  }
  return uid
}

const pendingRequestMember = (group, action, role) => {
  const userId = getUserId(group.slug)
  if (!userId) return
  axiosPut(
    {
      url: `${process.env.GATSBY_API_URL}/groups/${group._id}`,
      data: { [action]: { community: { user: userId, ...role } } }
    },
    ({ data: res }) => {
      if (res.status === 200 && res.data) {
        toast('Action effectuée !', 'success')
        reload()
      } else {
        toast('Une erreur interne est survenue', 'error')
      }
    },
    error => {
      console.log(error)
      toast('Une erreur interne est survenue', 'error')
    }
  )
}

export const addPendingRequest = group => {
  pendingRequestMember(group, '$push', { role: 'pending_request' })
}

export const removePendingRequest = group => {
  pendingRequestMember(group, '$pull', { role: 'pending_request' })
}

export const quitRequest = group => {
  pendingRequestMember(group, '$pull')
}

const pendingRequestAdmin = ({ group, userId }, roleIn, newRole) => {
  const query = {
    filter: {
      _id: group._id,
      community: {
        $elemMatch: {
          user: userId,
          role: { $in: roleIn }
        }
      }
    },
    update: {
      $set: {
        'community.$.role': newRole,
        'community.$.memberDate': Date.now()
      }
    }
  }
  axiosPut(
    { url: `${process.env.GATSBY_API_URL}/groups`, data: query },
    ({ data: res }) => {
      if (res.status === 200 && res.data) {
        toast('Action effectuée !', 'success')
        reload()
      } else {
        toast('Une erreur interne est survenue', 'error')
      }
    },
    error => {
      console.log(error)
      toast('Une erreur interne est survenue', 'error')
    }
  )
}

export const acceptPendingRequest = (group, userId) => {
  pendingRequestAdmin({ group, userId }, ['pending_request'], 'member')
}

export const denyPendingRequest = (group, userId) => {
  pendingRequestAdmin({ group, userId }, ['pending_request', 'member', 'admin'], 'denied')
}

export const grantPendingRequest = (group, userId) => {
  pendingRequestAdmin({ group, userId }, ['denied'], 'pending_request')
}

export const giveAdminRightRequest = (group, userId) => {
  pendingRequestAdmin({ group, userId }, ['member'], 'admin')
}

export const removeAdminRightRequest = (group, userId) => {
  pendingRequestAdmin({ group, userId }, ['admin'], 'member')
}
