import React from 'react'
import { Link, Page, Seo } from '../components/addons'

const NotFoundPage = () => (
  <Page>
    <Seo title="Page inexistante. Explorez donc la carte !" />
    <h1>Oups! Page inexistante.</h1>
    <p>Vous pouvez effectuer une recherche ou consulter l&rsquo;un des liens ci-dessous :</p>
    <ul>
      <li>
        <Link to="/">
          <strong>Accueil : Explorez la carte !</strong>
        </Link>
      </li>
    </ul>
  </Page>
)

export default NotFoundPage
