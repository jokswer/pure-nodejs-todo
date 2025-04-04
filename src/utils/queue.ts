const MAX_CONCURRENCY = 1;

type TTask = () => Promise<unknown>;

class Queue {
  private running = 0;
  private queue: TTask[] = [];

  private next() {
    while (this.running < MAX_CONCURRENCY && this.queue.length) {
      const task = this.queue.shift();
      task().finally(() => {
        this.running--;
        this.next();
      });
      this.running++;
    }
  }

  public pushTask(task: TTask) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
  }
}

export default Queue;
