import React, { Dispatch, SetStateAction } from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';

import ModalContext from './context/modal-context';

class Modal extends Component<{
  children: React.ReactNode
  toggleModal: Dispatch<SetStateAction<boolean>>
}> {
  [el: string]: any
  constructor(props) {
    super(props)
    this.modalRoot = document.getElementById('modal-root')
    this.el = document.createElement('div')
    this.modalContentRef = React.createRef()
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    console.log(this.modalContentRef.current)
    this.modalRoot.appendChild(this.el)

    this.setOnClickOutside()
  }

  setOnClickOutside() {
    const onClickOutside = e => {
      if (
        this.modalContentRef.current &&
        !this.modalContentRef.current.contains(e.target)
      ) {
        this.props.toggleModal(false)
      }
    }

    document.addEventListener('click', onClickOutside, true)

    return () => {
      document.removeEventListener('click', onClickOutside, true)
    }
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el)
    this.setOnClickOutside()
  }

  render() {
    return ReactDOM.createPortal(
      <div
        ref={this.modalContentRef}
        className="p-4 m-6 rounded-sm bg-wash-800 z-50 relative top-28"
      >
        <FaTimes
          className="cursor-pointer text-ash-500 text-3xl absolute top-4 right-4"
          onClick={() => this.props.toggleModal(false)}
        />
        {this.props.children}
      </div>,
      this.el
    )
  }
}

Modal.contextType = ModalContext

export default Modal
