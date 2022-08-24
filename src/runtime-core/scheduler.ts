const queue: any[] = []
let isFlushingJob = false

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }

  queueFlush()
}

function queueFlush() {
  // 防止多次设置响应式数据导致的重复flush，就不会重复生成Promise
  if (isFlushingJob) return 
  isFlushingJob = true // 开始更新开关
  nextTick(flushJobs)
}

function flushJobs() {
  isFlushingJob = false
  let job
  while (job = queue.shift()) {
    job && job()
  }
}

export function nextTick(fn) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve()
}

