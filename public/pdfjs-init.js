// Initialize PDF.js worker
if (typeof globalThis.pdfjsWorker === 'undefined') {
  globalThis.pdfjsWorker = {
    WorkerMessageHandler: {},
  };
}
