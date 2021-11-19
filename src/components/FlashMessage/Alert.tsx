import React from 'react';

import { MessageUI } from './interfaces';

export default function Alert(props: MessageUI) {
  const { status, children } = props;

  return (
    <div className={`alert alert-${status}`} id="message">
      <div className="alert__content">
        <strong className="alert__title">{`${status}!`}</strong>
        {children}
      </div>
    </div>
  );
}
