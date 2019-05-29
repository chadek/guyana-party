import { b } from './bling'
import { initGroupDropdown } from './utils'

function loadGroupsList () {
  const groupSelect = b('#group-select')
  const groupId = b('#group-id')
  if (!groupSelect || !groupId) return
  initGroupDropdown(groupSelect, groupId)
}

loadGroupsList()
