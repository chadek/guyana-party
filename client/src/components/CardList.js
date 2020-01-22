import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Slider from 'react-slick'
import Button from '@material-ui/core/Button'
// import Grid from '@material-ui/core/Grid'
import Card from './Card'
import { If } from './addons'

const Wrapper = styled.section`
  margin-bottom: 50px;
  h2 {
    font-size: 22px;
    text-transform: uppercase;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    button {
      margin: -0.7rem 1rem 0 1rem;
      position: absolute;
      right: 0;
    }
  }
  #container {
    .slick-track {
      margin-left: 0;
    }
  }
`

const loadingMsg = (loading, isGroup) =>
  loading ? <p>Chargement...</p> : <p>{`Aucun ${isGroup ? 'groupe' : 'évènement'}.`}</p>

const sliderConf = {
  dots: true,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    { breakpoint: 1500, settings: { slidesToShow: 4, slidesToScroll: 4 } },
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 980, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
  ]
}

const CardList = ({ addBtn, title, data, isGroup, loading, className, groupId, conf, isArchived }) => (
  <Wrapper className={className}>
    <h2>
      {`${title}${data.length > 0 ? ` (${data.length})` : ''}`}
      {addBtn && groupId && (
        <Button
          aria-label='Ajouter un évènement'
          onClick={() => navigate(`/app/event/new?group=${groupId}`)}
          size='small'
          title='Ajouter un évènement'
          variant='contained'
        >
          Ajouter
        </Button>
      )}
    </h2>
    <div id='container'>
      <If condition={data.length !== 0} otherwise={loadingMsg(loading, isGroup)}>
        {/* {(noSlider && (
            <Grid container spacing={1}>
              {data.map((d, index) => (
                <Grid item key={d.slug + index}>
                  <Card data={d} isArchived={isArchived} isGroup={isGroup} />
                </Grid>
              ))}
            </Grid>
          )) || ( */}
        <Slider {...(conf || sliderConf)}>
          {data.map((d, index) => (
            <Card data={d} isArchived={isArchived} isGroup={isGroup} key={d.slug + index} />
          ))}
        </Slider>
        {/* )} */}
      </If>
    </div>
  </Wrapper>
)

CardList.propTypes = {
  addBtn: PropTypes.bool,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGroup: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  groupId: PropTypes.string,
  conf: PropTypes.object,
  noSlider: PropTypes.bool,
  isArchived: PropTypes.bool
}

export default CardList
