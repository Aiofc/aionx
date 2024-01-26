interface Action {
  onCompleting: (sug: string) => void;
  onCompleted?: (sug: string) => void;
}

// 定义一个ChatService类
class ChatService {
  // 声明一个abortController
  private controller: AbortController;
  private static instance: ChatService;
  public actions?: Action;

  // 获取当前实例
  public static getInstace(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // 实例化一个AbortController
  private constructor() {
    this.controller = new AbortController();
  }
  // 定义一个getStream方法
  public async getStream(params: { url: string; question: string }) {
    let suggestion = '';
    try {
      const response = await fetch(params.url, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(params),
        signal: this.controller.signal,
      });
      const data = response.body;
      if (!data) {
        return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      while (!done) {
        const { value, done: doneReadingStream } = await reader.read();
        done = doneReadingStream;
        const chunkValue = decoder.decode(value);
        const data = JSON.parse(chunkValue).data;
        suggestion += data;
        this.actions?.onCompleting(suggestion);
      }
    } catch (error) {
      console.log('流转换错误：', error);
    } finally {
      this.actions?.onCompleted?.(suggestion);
      this.controller = new AbortController();
    }
  }
  // 定义一个cancel方法
  public cancel() {
    this.controller.abort();
  }
}

const chatService = ChatService.getInstace();

export default chatService;
