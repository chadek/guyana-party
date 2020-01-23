import Button from '@material-ui/core/Button'
import MUIDataTable from 'mui-datatables'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  acceptPendingRequest,
  confirmMember,
  countAdmins,
  denyPendingRequest,
  giveAdminRightRequest,
  grantPendingRequest,
  isAdmin,
  isMember,
  quitRequest,
  removeAdminRightRequest
} from '../lib/services/communityService'

const Wrapper = styled.section`
  margin-bottom: 50px;
  button {
    margin-right: 1rem;
  }
  h2 button {
    margin: -0.7rem 1rem 0 1rem;
    position: absolute;
    right: 0;
  }
`

const translate = {
  admin: {
    label: 'Admin',
    action: 'Retirer les droits admin'
  },
  pending_request: {
    label: 'En attente',
    action: 'Accepter la demande',
    action2: 'Refuser'
  },
  denied: {
    label: 'Bloqué(e)',
    action: 'Débloquer'
  },
  guest: {
    label: 'Invité'
  },
  member: {
    label: 'Membre',
    action: 'Donner les droits admin',
    action2: 'Bloquer'
  }
}

function Community({ group }) {
  const [data, setData] = useState([])
  const [showList, setShowList] = useState(false)
  const [showQuitBtn, setShowQuitBtn] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [member, setMember] = useState(false)
  const [adminNb, setAdminNb] = useState(1)

  useEffect(() => {
    setAdmin(isAdmin(group.community))
    setMember(isMember(group.community))
    setAdminNb(countAdmins(group.community))
    setShowList(
      confirmMember(group.community) &&
        !confirmMember(group.community, 'denied') &&
        !confirmMember(group.community, 'pending_request')
    )
  }, [group.community])

  useEffect(() => {
    setShowQuitBtn((admin && adminNb > 1) || member)
  }, [admin, adminNb, member])

  useEffect(() => {
    setData(group.community.map(m => [m.user.name, translate[m.role].label, `${m.role}__${m.user._id}`]))
  }, [group.community])

  const doAction = (role, action, id) => {
    if (role === 'admin') {
      if (translate[role].action === action) removeAdminRightRequest(group, id)
    } else if (role === 'pending_request') {
      if (translate[role].action === action) acceptPendingRequest(group, id)
      if (translate[role].action2 === action) denyPendingRequest(group, id)
    } else if (role === 'denied') {
      if (translate[role].action === action) grantPendingRequest(group, id)
    } else if (role === 'member') {
      if (translate[role].action === action) giveAdminRightRequest(group, id)
      if (translate[role].action2 === action) denyPendingRequest(group, id)
    }
  }

  const columns = !showList
    ? []
    : [
        'Nom',
        'Rôle',
        {
          name: 'Actions',
          options: {
            display: admin,
            filter: false,
            sort: false,
            customBodyRender(roleId) {
              const [role, id] = roleId.split('__')
              if (!admin || (role === 'admin' && adminNb === 1)) return null
              const { action, action2 } = translate[role]
              return (
                <>
                  <Button onClick={() => doAction(role, action, id)} size='small' variant='contained'>
                    {action}
                  </Button>
                  {action2 && (
                    <Button onClick={() => doAction(role, action2, id)} size='small' variant='contained'>
                      {action2}
                    </Button>
                  )}
                </>
              )
            }
          }
        }
      ]

  return (
    <Wrapper className='community'>
      <h2>
        La communauté
        {showQuitBtn && (
          <Button
            aria-label='Quitter la communauté'
            onClick={() => quitRequest(group)}
            size='small'
            title='Quitter la communauté'
            variant='contained'
          >
            Quitter
          </Button>
        )}
      </h2>
      {(showList && (
        <MUIDataTable
          columns={columns}
          data={data}
          options={{
            print: false,
            download: false,
            filterType: 'dropdown',
            responsive: 'scrollMaxHeight'
          }}
          title={data.length > 0 ? `${data.length} membre${data.length > 1 ? 's' : ''}` : ''}
        />
      )) || (
        <p>
          Vous souhaitez faire partie de la communauté, faites une demande d&rsquo;adhésion en cliquant sur le bouton
          correspondant en haut de la page.
        </p>
      )}
    </Wrapper>
  )
}

Community.propTypes = { group: PropTypes.object.isRequired }

export default Community
