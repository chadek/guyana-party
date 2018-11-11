import { B } from './bling'
import { initOrgaDropdown } from './utils'

function loadGroupsList () {
  const orgaSelect = B('#orga-select')
  const orgaId = B('#orga-id')
  if (!orgaSelect || !orgaId) return
  initOrgaDropdown(orgaSelect, orgaId)
}

loadGroupsList()
