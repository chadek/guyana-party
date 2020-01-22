import React, { useState } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import GpsFixed from '@material-ui/icons/GpsFixed'
import Shuffle from '@material-ui/icons/Shuffle'
import CircularProgress from '@material-ui/core/CircularProgress'
import Map from './MainMap'
import If from '../addons/If'
import ListItem from './ListItem'
import { showSnack } from '../Snack'

const Wrapper = styled.div`
  height: calc(100vh - ${props => props.theme.headerHeight});
  grid-template-columns: 67% auto;
  #map-section {
    padding: 5px;
  }
  #map-section #map {
    height: 100%;
  }
  #list-section {
    overflow: auto;
    grid-auto-rows: max-content;
    grid-gap: 0.5rem;
    padding: 0 5px 5px;
    background-color: #fff;
    #actions {
      position: fixed;
      width: 100%;
      background: #fff;
      padding: 5px 0;
      button:not(:first-of-type) {
        margin-left: 5px;
      }
      .progress {
        display: inline-flex;
        vertical-align: middle;
        margin-left: 0.5rem;
        div {
          width: 20px !important;
          height: 20px !important;
        }
      }
    }
    #events {
      grid-gap: 0.5rem;
      margin-top: 2.5rem;
    }
    #add-btn {
      padding: 10px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  @media (max-width: ${props => props.theme.md}) {
    grid-template-columns: auto;
    grid-template-rows: auto 1fr;
    #map-section {
      padding-top: 0;
      #map {
        height: 50vh;
      }
    }
    #list-section {
      #add-btn {
        padding: 5px 10px;
        button {
          width: 46px;
          height: 46px;
        }
      }
    }
  }
`

function Home() {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState('')
  const [mapActions, setMapActions] = useState({})

  const onMarkerClick = data => {
    console.log(data)
    setCurrent(data.slug)
  }

  return (
    <Wrapper className='grid'>
      <section id='map-section'>
        <If condition={typeof window !== 'undefined'}>
          <Map
            onMarkerClick={onMarkerClick}
            setActions={setMapActions}
            setLoading={setLoading}
            setMarkers={setMarkers}
          />
        </If>
      </section>
      <section className='grid' id='list-section'>
        <div id='actions'>
          <Button
            endIcon={<GpsFixed />}
            onClick={() => {
              if (mapActions.isDenied()) {
                return showSnack('La localisation a été désactivée !', 'info')
              }
              mapActions.locate()
            }}
            size='small'
            variant='outlined'
          >
            Autour de moi
          </Button>
          <Button endIcon={<Shuffle />} onClick={() => mapActions.random()} size='small' variant='outlined'>
            AléaTown
          </Button>
          {loading && (
            <span className='progress'>
              <CircularProgress />
            </span>
          )}
        </div>
        <div className='grid' id='events'>
          {markers &&
            markers.map((marker, index) => (
              <ListItem item={marker} key={marker.slug + index} selected={marker.slug === current} />
            ))}
        </div>
        <div id='add-btn'>
          <Fab
            aria-label='Créer un évènement'
            color='primary'
            onClick={() => navigate('/app/event/new')}
            title='Créer un évènement'
          >
            <AddIcon />
          </Fab>
        </div>
      </section>
    </Wrapper>
  )
}

export default Home
