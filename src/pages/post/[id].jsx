import React, { useRef, useEffect, useState } from 'react'
import Avatar from '@components/templates/Avatar'
import ICONBUTTON from '@components/templates/IconButton'
import DIVIDER from '@components/templates/Divider'
import GOODSIMG from '@components/templates/Banner'
import BUTTON from '@components/templates/Button'
import Dialog from '@components/templates/Dialog'
import useStorage from '@hooks/useStorage'
import SelectBox from '@components/templates/Selectbox'
import ModalOffer from '@components/ui/modal/ModalOffer'
import ModalLogin from '@components/ui/modal/ModalLogin'
import ModalConfirmBuyer from '@components/ui/modal/ModalConfirmBuyer'
import ModalChat from '@components/ui/modal/ModalChat'
import Pagination from '@components/templates/Pagination'
import Like from '@components/ui/InPostToggle'
import swal from 'sweetalert'
import { OFFER, OPTIONS } from '@utils/constant/icon'
import useApi from '@api/useApi'
import { useAuthContext } from '@hooks/useAuthContext'
import { timeForToday } from '@utils/functions'
import { USER } from '@utils/constant'
import { STATUSLIST } from '@data/dummy/postStatusdialogList'

export const getServerSideProps = async context => {
  return {
    props: {
      postId: context.query.id,
    },
  }
}
const { setItem } = useStorage()

const Post = ({ postId, data }) => {
  const { articleApi } = useApi()
  const { state } = useAuthContext()
  const userId = state.userData.id
  setItem('postId', postId)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [postData, setPostData] = useState([{}])
  const [isWriter, setisWriter] = useState(false)
  const [imgUrls, setimgUrls] = useState([])
  const [tradeStatus, setTradeStatus] = useState(false)
  const [finishTrade, setFinishTrade] = useState(false)
  const [offerList, setOfferList] = useState([{}])
  const [isMounted, setMounted] = useState(false)
  const [offerId, setOfferId] = useState(false)

  const [checkOfferOptions, setOfferOptions] = useState({
    articleId: postId,
    params: {
      page: 1,
      size: 5,
    },
  })

  const handleOffers = pageNum => {
    setOfferOptions({
      ...checkOfferOptions,
      params: {
        ...checkOfferOptions.params,
        page: pageNum,
      },
    })
  }

  const [visible, setVisible] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [chatVisible, setChatVisible] = useState(false)

  useEffect(async () => {
    const imageUrls = await articleApi.getImgUrlList(postId)
    const { data } = await articleApi.getArticleUserID(postId)
    const offerList = await articleApi.getOfferListPage(checkOfferOptions)
    setPostData(data.article)
    setimgUrls(imageUrls.data.imageUrls)
    setOfferList(offerList.data)
    data.article.author.id === userId ? setisWriter(true) : setisWriter(false)
    data.article.tradeStatus.name === '?????????'
      ? setTradeStatus(true)
      : setTradeStatus(false)
    data.article.tradeStatus.name === '????????????'
      ? setFinishTrade(true)
      : setFinishTrade(false)
    setMounted(true)
  }, [state, checkOfferOptions])

  const dialogClick = e => {
    setItem('postData', postData)
    setItem('imgUrl', imgUrls)
    e.stopPropagation()
    setDialogVisible(true)
  }

  const handleChange = async e => {
    if (finishTrade) {
      swal({
        // className: 'finish-alert',
        title: '?????? ????????? ????????? ??????????????????!',
        text: '?????? ????????? ??????????????? ????????????????',
        icon: 'error',
        button: '???',
      })
      e.target.value = await postData.tradeStatus.code
      return
    }
    const code = Number(e.target.value)
    const getPostId = postId

    if (code === 2) {
      if (offerList.elements.length === 0) {
        swal({
          // className: 'finish-alert',
          title: '????????? ?????? ???????????? ????????? ??? ??? ?????????!',
          text: '?????? ????????? ?????????',
          icon: 'error',
          button: '???',
        })
        e.target.value = await postData.tradeStatus.code
        return
      }
      // ?????????
      swal({
        title: '??????????????? ?????????????????????????',
        text: '??????????????? ??????????????? ???????????? ?????? ????????? ????????? ?????? ?????????',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async changeStatus => {
        if (changeStatus) {
          const res = await articleApi.changeTradeStatus({
            articleId: getPostId,
            option: {
              code: 2,
            },
          })
          swal('????????? ??????????????? ??????????????????!', {
            icon: 'success',
          })
          setTradeStatus(false)
          setFinishTrade(false)
        } else {
          swal('????????? ??????????????????!')
          e.target.value = await postData.tradeStatus.code
        }
      })
    }
    if (code === 4) {
      swal({
        title: '????????? ???????????? ??????????????? ????????????????',
        text: '????????? ??????????????? ????????? ????????? ?????? ?????????',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async changeStatus => {
        if (changeStatus) {
          const res = await articleApi.changeTradeStatus({
            articleId: getPostId,
            option: {
              code: 4,
            },
          })
          setTradeStatus(true)
          setFinishTrade(false)
          swal('????????? ??????????????? ??????????????????!', {
            icon: 'success',
          })
        } else {
          swal('????????? ??????????????????!')
          e.target.value = await postData.tradeStatus.code
        }
      })
    }
    if (code === 8) {
      // ????????????
      if (offerList.elements.length === 0) {
        swal({
          // className: 'finish-alert',
          title: '????????? ?????? ???????????? ????????? ?????? ??? ??? ?????????',
          text: '?????? ????????? ?????????',
          icon: 'error',
          button: '???',
        })
        e.target.value = await postData.tradeStatus.code
        return
      }
      swal({
        title: '??????????????? ????????? ????????? ??? ?????????. ????????????????',
        text: '???????????? ???????????? ??????????????? ?????? ????????? ????????????',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async changeStatus => {
        if (changeStatus) {
          setTradeStatus(false)
          setConfirmVisible(true)
        } else {
          swal('????????? ??????????????????!')
          e.target.value = await postData.tradeStatus.code
        }
      })
      // if (confirm('??????????????? ????????? ????????? ??? ????????????. ?????????????????????????')) {
      //   setTradeStatus(false)
      //   setConfirmVisible(true)
      // } else {
      //   e.target.value = await postData.tradeStatus.code
      // }
    }
  }

  const chatClick = async (offerId, e) => {
    if (finishTrade) {
      swal({
        // className: 'finish-alert',
        title: '?????? ????????? ????????? ??????????????????!',
        text: '?????? ????????? ??????????????? ????????????????',
        icon: 'error',
        button: '???',
      })

      return
    }
    await setChatVisible(true)
    await setOfferId(offerId)
  }

  return (
    <div className="detail">
      {isMounted && (
        <>
          <div className="detail-info-wrapper">
            <div className="img-wrapper">
              {tradeStatus ? (
                <GOODSIMG
                  imgUrls={imgUrls}
                  style={{
                    width: '100%',
                    height: '380px',
                    padding: '0px',
                  }}
                  src="https://picsum.photos/200"
                  ratio="r"
                  isPost
                />
              ) : (
                <div className="finish">
                  <GOODSIMG
                    imgUrls={imgUrls}
                    style={{
                      width: '100%',
                      height: '380px',
                      padding: '0px',
                      filter: 'brightness(50%)',
                    }}
                    src="https://picsum.photos/200"
                    ratio="r"
                    isPost
                  />
                  {finishTrade ? (
                    <div className="finish-message">????????????</div>
                  ) : (
                    <div className="finish-message">????????????</div>
                  )}
                </div>
              )}
            </div>
            <div className="post-info-wrapper">
              <div className="post-info">
                <div className="post-info-user">
                  <Avatar
                    src={postData.author.profileImageUrl || USER}
                    style={{ width: '46.97px', height: '47px' }}
                  />
                  <div className="user-name">{postData.author.nickname}</div>
                </div>

                <DIVIDER
                  type="horizontal"
                  style={{
                    marginTop: '15px',
                    backgroundColor: '#D2D2D2',
                    width: '100%',
                  }}
                />
                {isWriter && (
                  <div className="status-wrapper">
                    <SelectBox
                      style={{
                        fontSize: '10px',
                        width: '100px',
                        height: '30px',
                      }}
                      onChange={handleChange}
                      formName="trade"
                      options={STATUSLIST}
                      className="status"
                      defaultOption={{
                        code: postData.tradeStatus.code,
                        name: postData.tradeStatus.name,
                      }}
                    />
                    <ICONBUTTON
                      className="options"
                      src={OPTIONS}
                      onClick={dialogClick}
                      style={{
                        width: '30px',
                        height: '30px',
                      }}
                    />
                    <Dialog
                      className="status-list"
                      style={{ justifyContent: 'space-between' }}
                      items={[
                        {
                          code: 'modify',
                          name: '????????? ??????',
                        },
                        {
                          code: 'delete',
                          name: '????????? ??????',
                        },
                      ]}
                      visible={dialogVisible}
                      isFinishtrade={finishTrade}
                      onClose={() => setDialogVisible(false)}
                    />
                  </div>
                )}
                <div className="post-info-top">
                  <div className="post-title">{postData.title}</div>
                  {!state.token && (
                    <Like
                      className="like-button"
                      style={{
                        padding: '0px',
                        height: '25px',
                        lineHeight: '30px',
                      }}
                      isLiked={postData.isLiked}
                    />
                  )}
                </div>

                <div className="post-price">
                  {postData.price.toLocaleString()} ???
                </div>

                <div className="post-info-bottom">
                  <div className="post-info-bottom_time">
                    <div className="info-key">????????????</div>
                    <div className="info-value">
                      {timeForToday(postData.modifiedDate)}
                    </div>
                  </div>
                  <div className="post-info-bottom_time">
                    <div className="info-key">????????????</div>
                    <div className="info-value">{postData.tradeArea}</div>
                  </div>
                  <div className="post-info-bottom_time">
                    <div className="info-key">????????????</div>
                    <div className="info-value">
                      {postData.productStatus.name}
                    </div>
                  </div>
                  <div className="post-info-bottom_time">
                    <div className="info-key">????????????</div>
                    <div className="info-value">
                      {postData.tradeMethod.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info-offer-wrapper">
            <div className="goods-info">
              <div className="goods-info-title">????????????</div>
              <DIVIDER
                type="horizontal"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#000000',
                  width: '100%',
                  height: '2px',
                  fontWeight: 'bold',
                }}
              />
              <div className="goods-info-content">{postData.content}</div>
            </div>
            <div className="goods-info">
              <div className="goods-info-title">????????????</div>
              <DIVIDER
                type="horizontal"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#000000',
                  height: '2px',
                  width: '100%',
                }}
              />
              <div className="offer-wrapper">
                {offerList.elements.length > 0 ? (
                  <div className="offer-user-infos">
                    {offerList.elements.map(offererList => (
                      <div className="offer-user-info" key={offererList.id}>
                        <div className="offer-subinfo">
                          <div className="offer-username">
                            {offererList.offerer.nickname}
                          </div>
                          <div className="subinfo-wrapper">
                            <div className="offer-address">
                              <div className="address">
                                {offererList.offerer.address} ???
                              </div>
                              <div className="offer-time">
                                &nbsp;{timeForToday(offererList.createdDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="offer-suggestinfo">
                          <div className="offer-price">
                            {offererList.price.toLocaleString()} ???
                          </div>
                          {isWriter && (
                            <ICONBUTTON
                              className="offer-send-button"
                              style={{ width: '30px', height: '30px' }}
                              src={OFFER}
                              onClick={e => {
                                chatClick(offererList.id, e)
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="not-offer-wrapper">
                    <div className="offer-state_ban">
                      ?????? ????????? ????????? ????????? ????????? ????????? ??????????
                    </div>
                  </div>
                )}
              </div>
              <DIVIDER
                type="horizontal"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#CCCCCC',
                  width: '100%',
                }}
              />
              <div className="offer-option">
                <Pagination
                  size={offerList.pageInfo.sizePerPage}
                  postListLength={offerList.pageInfo.totalElementCount}
                  paginate={handleOffers}
                  setStartPage={handleOffers}
                />
                <div className="offer-state">
                  {state.token ? (
                    <>
                      {tradeStatus ? (
                        <>
                          {isWriter ? (
                            <div className="offer-state_ban">
                              ??? ???????????? ????????? ??? ??? ?????????!
                            </div>
                          ) : (
                            <>
                              {offerList.offerCountOfCurrentMember < 2 ? (
                                <BUTTON
                                  className="offer-button"
                                  onClick={() =>
                                    state.token
                                      ? setVisible(true)
                                      : setLoginVisible(true)
                                  }>
                                  ?????? ????????????(
                                  {offerList.offerCountOfCurrentMember}
                                  /2)
                                </BUTTON>
                              ) : (
                                <BUTTON className="offer-ban-button" disabled>
                                  ?????? ?????? ?????? ?????? (
                                  {offerList.offerCountOfCurrentMember}/2)
                                </BUTTON>
                              )}

                              <ModalOffer
                                visible={visible}
                                onClose={() => setVisible(false)}>
                                ????????????
                              </ModalOffer>
                              <ModalLogin
                                visible={loginVisible}
                                onClose={() => setLoginVisible(false)}>
                                ????????? ??????
                              </ModalLogin>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="offer-state_ban">
                          ?????????????????? ??????????????? ????????? ??????????????? ??? ???
                          ?????????!
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="offer-state_ban">
                      ???????????? ???????????? ???????????? ??? ??? ?????????!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ModalConfirmBuyer
            visible={confirmVisible}
            postId={postId}
            offerList={offerList}
            postData={postData}>
            ????????? ?????? ??????
          </ModalConfirmBuyer>
          <ModalChat
            visible={chatVisible}
            onClose={() => setChatVisible(false)}
            postId={postId}
            offerId={offerId}>
            ?????? ??????
          </ModalChat>
        </>
      )}
    </div>
  )
}

Post.propTypes = {}

export default Post
