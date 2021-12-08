import React, { useState } from 'react'
import Radio from '@components/templates/Radio'
import Input from '@components/templates/Input'
import Button from '@components/templates/Button'
import IconButton from '@components/templates/IconButton'
import Image from '@components/templates/Image'
import Divider from '@components/templates/Divider'
import useClickAway from '@hooks/useClickAway'
import { CATEGORIES } from '../data/dummy/categories'
import { ORDERWAY } from '../data/dummy/orderway'

const search = props => {
  const ref = useClickAway(e => {
    setIsopenedFilter(false)
  })
  const [isopenedFilter, setIsopenedFilter] = useState(false)

  const inputStyle = {
    width: '95px',
    height: '44px',
    padding: '12px 20px',
    fontSize: '14px',
  }

  const btnStyle = {
    width: '150px',
    height: '40px',
    fontSize: '14px',
  }

  const resetBtnStyle = {
    marginRight: '30px',
    border: '1px solid #f74f2a',
    background: '#fff',
    color: '#f74f2a',
  }

  return (
    <div className="search">
      <div className={isopenedFilter ? 'filter-mask show' : 'filter-mask'}>
        <div className="filter-container" ref={ref}>
          <div className="filter-wrapper">
            <div className="filter-cont-wrapper">
              <div className="filter-cont">
                <h3 className="filter-cont_title">카테고리</h3>
                <ul className="filter-cont_item-list category">
                  {CATEGORIES.map(({ code, name }) => (
                    <li key={code} className="filter-cont_item">
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="filter-cont">
                <h3 className="filter-cont_title">거래방식</h3>
                <div className="filter-cont_item-list orderway">
                  <Radio
                    formName="orderWay"
                    items={ORDERWAY}
                    className="filter-cont_item"
                    size="21px"
                    fontSize="14px"
                    radioDirection="vertical"
                  />
                </div>
              </div>
              <div className="filter-cont">
                <h3 className="filter-cont_title">가격</h3>
                <div className="filter-cont_item-list">
                  <p className="filter-cont_item-input">
                    <Input
                      placeholder="최소 가격"
                      style={{ ...inputStyle, marginRight: '20px' }}
                    />
                    <Input placeholder="최대 가격" style={inputStyle} />
                  </p>
                  <p className="filter-cont_item-notice">
                    가격은 숫자로만 입력할 수 있어요!
                  </p>
                </div>
              </div>
            </div>
            <div className="filter-btn-wrapper">
              <Button style={{ ...btnStyle, ...resetBtnStyle }}>초기화</Button>
              <Button style={btnStyle}>필터 적용</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="result-container">
        <div className="result-header">
          <div className="result-title">
            <h3>"maison margiela"의 검색결과</h3>
            <span>30</span>
          </div>
          <div className="result-filter-wrapper">
            <div className="result-filter">
              <div
                className="result-filter_btn"
                onClick={() => setIsopenedFilter(!isopenedFilter)}>
                <span>필터</span>
                <IconButton
                  className="result-filter_btn-icon"
                  src={require('@assets/images/icon/filter.svg').default.src}
                  alt="필터"
                  onClick={() => {
                    console.log('필터')
                  }}
                />
              </div>
            </div>
            <div className="result-filter_sort">
              <div className="result-filter_sort-item recent active">
                최신순
              </div>
              <div className="result-filter_sort-item price-low">
                낮은 가격순
              </div>
              <div className="result-filter_sort-item price-high">
                높은 가격순
              </div>
            </div>
          </div>
        </div>
        <div className="result-body">
          <div className="result-item-list">
            <div className="result-item">
              <div className="result-item_cont">
                <Image
                  className="result-item_cont-img"
                  width="180px"
                  height="225px"
                  src="https://picsum.photos/200/300"
                />
                <IconButton
                  className="result-item_cont-heart"
                  src={
                    require('@assets/images/icon/heart_blank.svg').default.src
                  }
                  alt="필터"
                  onClick={() => {
                    console.log('필터')
                  }}
                />
              </div>
              <p className="result-item_title">MaisonMargiela wool swater</p>
              <div className="result-item_meta">
                <span>관악구 봉천동</span>
                <Divider
                  type="vertical"
                  height="8"
                  style={{ border: '1px solid #ddd' }}
                />
                <span>2분 전</span>
              </div>
              <p className="result-item_price">165,000원</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default search