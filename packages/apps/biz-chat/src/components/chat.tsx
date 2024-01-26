'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMobileScreen } from '../utils/utils';
import * as z from 'zod';
import {
  fetchEventSource,
  EventStreamContentType,
} from '@fortaine/fetch-event-source';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@aionx/aionx-ui';
import { Markdown } from './markdown';
import chatService from '../utils/chat-service';

const Schema = z.object({ query: z.string().min(1) });

type FormValue = z.infer<typeof Schema>;

export default function _Chat() {
  const form = useForm<FormValue>({
    resolver: zodResolver(Schema),
    defaultValues: {
      query: '给我写一段ts代码，用markdown',
    },
  });

  chatService.actions = {
    onCompleting: (sug) => setMessage(sug),
  };

  const decoder = new TextDecoder('utf-8');

  let remainText = '';

  const [message, setMessage] = useState('');
  const isMobileScreen = useMobileScreen();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async ({ query }: z.infer<typeof Schema>) => {
    await fetchEventSource(`/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
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
        console.log('adsfadsfasdf');
        if (event.data === '[DONE]') {
          return;
        }
        const text = event.data;
        try {
          const json = JSON.parse(text) as {
            choices: Array<{
              delta: {
                content: string;
              };
            }>;
          };
          const delta = json.choices[0]?.delta?.content;
          if (delta) {
            remainText += delta;
            console.log(remainText);
            setMessage(remainText);
          }
        } catch (e) {
          console.error('[Request] parse error', text);
        }
      },
    });
  };

  const onChatBodyScroll = (e: HTMLElement) => {
    const bottomHeight = e.scrollTop + e.clientHeight;
    const isHitBottom =
      bottomHeight >= e.scrollHeight - (isMobileScreen ? 4 : 10);

    setAutoScroll(isHitBottom);
  };

  function useScrollToBottom() {
    // for auto-scroll
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    function scrollDomToBottom() {
      const dom = scrollRef.current;
      if (dom) {
        requestAnimationFrame(() => {
          setAutoScroll(true);
          dom.scrollTo(0, dom.scrollHeight);
        });
      }
    }

    // auto scroll
    useEffect(() => {
      if (autoScroll) {
        scrollDomToBottom();
      }
    });

    return {
      scrollRef,
      autoScroll,
      setAutoScroll,
      scrollDomToBottom,
    };
  }

  const { scrollRef, setAutoScroll, scrollDomToBottom } = useScrollToBottom();
  return (
    <div className="flex flex-col relative h-full">
      <div
        className="flex-1 overflow-auto overflow-x-hidden p-20 pb-40 relative overscroll-none"
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onMouseDown={() => inputRef.current?.blur()}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        _Chat
        {/* <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button className="ml-auto" type="submit">
            按钮
          </Button>
        </form>
        <Markdown content={message} /> */}
      </div>

      <div>
        <Button
          onClick={async () => {
            await chatService.getStream({
              url: '/api/chat',
              question: '',
            });
          }}
        >
          按钮
        </Button>
        <Markdown content={message} />
      </div>
      <div>
        <Button
          onClick={() => {
            chatService.cancel();
          }}
        >
          停止
        </Button>
      </div>
    </div>
  );
}
