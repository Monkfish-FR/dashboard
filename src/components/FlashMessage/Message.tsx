import React from 'react';

import { MessageUI } from './interfaces';

export default function Message(props: MessageUI) {
  const { status, children } = props;

  return (
    <div className={`message message-${status}`} id="message">
      {children}
    </div>
  );
}
