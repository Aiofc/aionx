import { NextRequest } from 'next/server';

export const runtime = 'edge';

function iteratorToStream(iterator: any) {
  try {
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next();

        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
    });
  } catch (error) {
    console.error('停止', error);
  }
}
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

export async function POST(req: NextRequest) {
  // const counter = 0;
  try {
    // return new Response(await createStream(`你好，我是AI助手`, counter), {
    //   headers: { 'Content-Type': 'text/html; charset=utf-8' },
    // });
    return new Response(
      iteratorToStream(
        makeIterator(`在一座数字之城，有一位年轻的程序员，名叫艾伦。他身临一家创新科技公司，日夜奋斗于代码的海洋中。艾伦是这个城市的一颗耀眼的明星，他的键盘敲击声如同交响乐章，每一行代码都是他思维的延伸。

    有一天，公司迎来了一个重要项目，要求在短时间内完成一个复杂的软件系统。压力之下，艾伦决定挑战自己，将这个任务当成一个编程的冒险。

    他在代码的世界里穿行，解决一个个难题，仿佛是一个勇者闯过重重关卡。在他的屏幕上，算法的精妙舞动，逻辑的火花四溅。他仿佛进入了一个虚拟的奇幻国度，与错误战斗，与挑战较量。

    艾伦的同事们纷纷投入到这场代码的盛宴中，大家共同奋战，相互协作。他们的键盘声交织成一曲激昂的交响乐，每一位程序员都是这场乐章中不可或缺的音符。

    最终，在团队的共同努力下，软件系统如期完成。那一刻，办公室里爆发出阵阵掌声，每个人的脸上都洋溢着成功的喜悦。艾伦感受到了编程的魅力，那种战胜困难、创造出新世界的成就感让他陶醉不已。

    这个故事告诉我们，编程不仅是一项技能，更是一场冒险。在代码的世界里，每个程序员都是一位冒险家，用键盘和鼠标开启属于自己的奇幻之旅。`)
      ),
      {
        headers: { 'Content-Type': 'text/event-stream' },
      }
    );
  } catch (error) {
    console.log('error', error);
  }
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function* makeIterator(texts: string) {
  for (const text of texts) {
    yield encoder.encode(`{"data": "${text}"}`);
    await sleep(150);
  }
  yield encoder.encode(`{"data": "[DONE]"}`);
}
