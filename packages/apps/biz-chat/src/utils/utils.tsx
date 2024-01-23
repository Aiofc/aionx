import { useEffect, useState } from 'react';
import { toast } from '@aionx/aionx-ui';

export function trimTopic(topic: string) {
  // Fix an issue where double quotes still show in the Indonesian language
  // This will remove the specified punctuation from the end of the string
  // and also trim quotes from both the start and end if they exist.
  return topic
    .replace(/^["“”]+|["“”]+$/g, '')
    .replace(/[，。！？”“"、,.!?]*$/, '');
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
}

export const MOBILE_MAX_WIDTH = 600;
export function useMobileScreen() {
  const { width } = useWindowSize();

  return width <= MOBILE_MAX_WIDTH;
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: 'Copy Success',
    });
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast({
        title: 'Copy Success',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
      });
    }
    document.body.removeChild(textArea);
  }
}
