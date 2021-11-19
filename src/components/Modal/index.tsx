import React, { useEffect, useState } from 'react';

import Bus from '../../utils/bus';

import './Modal.scss';

export default function Modal() {
  const [modalShow, setModalShow] = useState(false);
  const [children, setChildren] = useState(false);

  const hide = () => {
    setModalShow(false);
  };

  const show = () => {
    setModalShow(true);
  };

  useEffect(() => {
    Bus.addListener('modal:open', ({ content }) => {
      setChildren(content);
      show();
    });

    Bus.addListener('modal:close', () => {
      hide();
    });
  }, []);

  useEffect(() => {
    const modalDiv = document.getElementById('modal') || null;

    if (modalDiv) {
      modalDiv.addEventListener('click', (event: any) => {
        if (event.target.id === 'modal') hide();
      });
    }
  });

  let modal = null;

  if (modalShow) {
    modal = (
      <div className="modal" id="modal">
        <div className="modal__content">
          {children}
        </div>
      </div>
    );
  }

  return modal;
}
