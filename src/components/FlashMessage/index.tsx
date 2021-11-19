import React, { useEffect, useState } from 'react';

import Alert from './Alert';
import Message from './Message';
import Bus from '../../utils/bus';

import './FlashMessage.scss';

export default function FlashMessage() {
  const [messageShow, setMessageShow] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageStatus, setMessageStatus] = useState('');

  const hide = () => {
    setMessageShow(false);
    setMessageContent('');
    setMessageStatus('');
  };

  const show = () => {
    setMessageShow(true);
  };

  useEffect(() => {
    Bus.addListener('flash', ({ content, status }) => {
      setMessageContent(content);
      setMessageStatus(status);

      show();
    });
  }, []);

  useEffect(() => {
    const messageDiv = document.getElementById('message') || null;

    if (messageDiv) {
      messageDiv.addEventListener('click', () => {
        hide();
      });
    }
  });

  let component = null;

  if (messageShow) {
    component = messageStatus === 'error'
      ? (
        <Alert status={messageStatus}>
          {messageContent}
        </Alert>
      )
      : (
        <Message status={messageStatus}>
          {messageContent}
        </Message>
      );
  }

  return component;
}
