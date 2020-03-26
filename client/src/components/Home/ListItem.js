import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Image, Link } from '../addons'
import { formatPlage } from '../../lib/date'

const Wrapper = styled.div`
  padding: 5px;
  border: 1px solid rgb(239, 239, 239);
  background-color: #fff;
  &.selected {
    box-shadow: 1px 1px 5px blue;
  }
  &:hover {
    box-shadow: 1px 1px 5px grey;
  }
  a.grid {
    grid-template-columns: auto 1fr;
    grid-gap: 5px;
    height: 82px;
    img {
      width: 82px;
      height: 100%;
    }
    .content {
      overflow: hidden;
      padding: 5px;
      h2,
      h3 {
        margin-top: inherit;
        margin-bottom: 0.3rem;
      }
      h2 {
        font-size: 1.2rem;
      }
      h3,
      p {
        font-size: 0.9rem;
      }
      p {
        margin-bottom: 0;
      }
    }
  }
  @media (min-width: ${props => props.theme.md}) and (max-width: ${props => props.theme.lg}),
    (max-height: ${props => props.theme.sm}) {
    a.grid {
      height: 75px;
      img {
        width: 75px;
      }
      .content {
        h2 {
          font-size: 1rem;
        }
        h3 {
          font-size: 0.8rem;
        }
      }
    }
  }
  @media (max-width: ${props => props.theme.xs}) {
    a.grid {
      height: 75px;
      img {
        width: 75px;
      }
    }
  }
`

const ListItem = ({ item, selected }) => (
  <Wrapper className={selected ? 'selected' : ''}>
    <Link className="grid" to={`/event/${item.slug}`}>
      <Image alt={item.name} className="cover" src={item.photos.length > 0 ? item.photos[0] : ''} />
      <div className="content">
        <h2 className="text-wrap">{item.name}</h2>
        <h3 className="text-wrap">{item.group && item.group.name}</h3>
        <p>{formatPlage(item)}</p>
      </div>
    </Link>
  </Wrapper>
)

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool
}

export default React.memo(ListItem)
