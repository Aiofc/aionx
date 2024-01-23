'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMobileScreen } from '../utils/utils';
import * as z from 'zod';
import {
  fetchEventSource,
  EventStreamContentType,
} from '@microsoft/fetch-event-source';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@aionx/aionx-ui';
import { Markdown } from './markdown';

const Schema = z.object({ query: z.string().min(1) });

type FormValue = z.infer<typeof Schema>;

export default function _Chat() {
  const form = useForm<FormValue>({
    resolver: zodResolver(Schema),
    defaultValues: {
      query: '给我写一段ts代码，用markdown',
    },
  });

  let remainText = '';

  const [message, setMessage] = useState('');
  const isMobileScreen = useMobileScreen();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async ({ query }: z.infer<typeof Schema>) => {
    await fetchEventSource(`https://aishell.work/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          { role: 'system', content: 'Hello, how are you?' },
          { role: 'user', content: query },
        ],
      }),
      async onopen(response) {
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button className="ml-auto" type="submit">
            按钮
          </Button>
        </form>
        <Markdown content={message} />
      </div>
    </div>
  );
}
