'use client';
import React, { useState } from 'react';
import {
  fetchEventSource,
  EventStreamContentType,
} from '@fortaine/fetch-event-source';
import { Button } from '@aionx/aionx-ui';
import { set } from 'react-hook-form';

export default function page() {
  let remainText = '';
  const [message, setMessage] = useState<string>('');
  const onSubmit = async () => {
    await fetchEventSource(`/api/chunk-example`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      async onopen(response) {
        console.log(response.headers.get('content-type'));
        if (
          response.ok &&
          response.headers.get('content-type') === EventStreamContentType
        ) {
          return; // everything's good
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          if (response.status === 402) {
            //throw new ApiError(ApiErrorType.USAGE_LIMIT);
          }
          // client-side errors are usually non-retriable:
          //throw new FatalError();
        } else {
          //throw new RetriableError();
        }
      },
      onclose() {
        // if the server closes the connection unexpectedly, retry:
        console.log('onclose');
      },
      onerror(err) {
        console.log('onerror');
        throw new Error(err);
      },
      async onmessage(event) {
        if (event.data === '[DONE]') {
          return;
        }
        const text = event.data;
        try {
          remainText += text;
          setMessage(remainText);
        } catch (e) {
          console.error('[Request] parse error', text);
        }
      },
    });
  };

  return (
    <div>
      <Button onClick={() => onSubmit()}>确定</Button>
      {message}
    </div>
  );
}
