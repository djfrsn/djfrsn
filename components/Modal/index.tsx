import React from 'react';

export default () => {
  let [modal, setModal] = React.useState(false)
  let [modalContent, setModalContent] = React.useState('')

  let handleModal = content => {
    setModal(!modal)
    if (content) {
      setModalContent(content)
    }
  }

  return { modal, handleModal, modalContent }
}
