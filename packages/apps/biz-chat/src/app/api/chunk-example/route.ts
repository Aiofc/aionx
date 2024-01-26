import { NextRequest } from 'next/server';

// A generator that will yield positive integers
const encoder = new TextEncoder();

async function* makeIterator(
  texts: string
): AsyncGenerator<Uint8Array, void, unknown> {
  for (const text of texts) {
    yield encoder.encode(`data: ${text}\n\n`);
    await sleep(100);
  }
  yield encoder.encode(`data: [DONE]\n\n`);
}
// Add a custom sleep function to create
// a delay that simulates how slow some
// Function responses are.
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Wraps a generator into a ReadableStream
function createStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
  return new ReadableStream({
    // The pull method controls what happens
    // when data is added to a stream.
    async pull(controller) {
      const { value, done } = await iterator.next();
      // done == true when the generator will yield
      // no more new values. If that's the case,
      // close the stream.
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
// Demonstrate handling backpressure
async function backpressureDemo() {
  // Set up a stream of integers
  const stream = createStream(
    makeIterator(`在一座数字之城，有一位年轻的程序员，名叫艾伦。他身临一家创新科技公司，日夜奋斗于代码的海洋中。艾伦是这个城市的一颗耀眼的明星，他的键盘敲击声如同交响乐章，每一行代码都是他思维的延伸。

  有一天，公司迎来了一个重要项目，要求在短时间内完成一个复杂的软件系统。压力之下，艾伦决定挑战自己，将这个任务当成一个编程的冒险。

  他在代码的世界里穿行，解决一个个难题，仿佛是一个勇者闯过重重关卡。在他的屏幕上，算法的精妙舞动，逻辑的火花四溅。他仿佛进入了一个虚拟的奇幻国度，与错误战斗，与挑战较量。

  艾伦的同事们纷纷投入到这场代码的盛宴中，大家共同奋战，相互协作。他们的键盘声交织成一曲激昂的交响乐，每一位程序员都是这场乐章中不可或缺的音符。

  最终，在团队的共同努力下，软件系统如期完成。那一刻，办公室里爆发出阵阵掌声，每个人的脸上都洋溢着成功的喜悦。艾伦感受到了编程的魅力，那种战胜困难、创造出新世界的成就感让他陶醉不已。

  这个故事告诉我们，编程不仅是一项技能，更是一场冒险。在代码的世界里，每个程序员都是一位冒险家，用键盘和鼠标开启属于自己的奇幻之旅。`)
  );
  return stream;
}

export async function POST(req: NextRequest) {
  return new Response(await backpressureDemo(), {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
