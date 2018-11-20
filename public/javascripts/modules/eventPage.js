import { b } from './bling'
import { initOrgaDropdown } from './utils'

function loadGroupsList () {
  const orgaSelect = b('#orga-select')
  const orgaId = b('#orga-id')
  if (!orgaSelect || !orgaId) return
  initOrgaDropdown(orgaSelect, orgaId)
}

loadGroupsList()
