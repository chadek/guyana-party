import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { createGlobalStyle } from 'styled-components'

export const theme = {
  headerHeight: '44px',
  linkColor: '#0078a8',
  // black: 'rgb(72, 72, 72)',
  borderColor: 'rgba(151, 151, 151, 0.2)',
  errorColor: 'rgb(248, 99, 73)',
  errorBorderColor: 'rgb(248, 187, 73)',
  errorBgColor: 'rgb(254, 245, 231)',
  black: '#000',
  gray: '#dadce0',
  xl: '1680px',
  lg: '1280px',
  md: '980px',
  sm: '736px',
  xs: '480px'
}

/** Global style for components */
export const Style = createGlobalStyle`
  a {
    text-decoration: none;
    color: ${props => props.theme.black};
  }

  .desc-content {
    h2,
    h3,
    h4 {
      margin-top: 1rem;
    }
    p {
      margin: 0.5rem 0;
    }
  }
`
