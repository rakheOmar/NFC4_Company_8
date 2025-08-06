export const offlineQueue = {
  getQueue: () => {
    return JSON.parse(localStorage.getItem("offlineQueue") || "[]");
  },

  addToQueue: (request) => {
    const queue = offlineQueue.getQueue();
    queue.push(request);
    localStorage.setItem("offlineQueue", JSON.stringify(queue));
  },

  processQueue: async () => {
    const queue = offlineQueue.getQueue();
    if (queue.length === 0) {
      return;
    }

    console.log("Processing offline queue...");
    for (const request of queue) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(request.body),
        });
      } catch (error) {
        console.error("Failed to process queued request:", error);
        // If it fails again, you might want to leave it in the queue
        // or handle it differently.
      }
    }

    // Clear the queue after processing
    localStorage.removeItem("offlineQueue");
    console.log("Offline queue processed.");
  },
};
