function retryAsync<T>(
    fn: () => Promise<T>,       // The async function to retry
    retries: number = 3,        // Maximum number of retries
    delay: number = 1000,       // Delay between retries in milliseconds
    backoffFactor: number = 2   // Multiplier for exponential backoff (optional)
): Promise<T> {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        const execute = async () => {
            try {
                const result = await fn();
                resolve(result);
            } catch (error) {
                if (attempt < retries) {
                    attempt++;
                    const nextDelay = delay * Math.pow(backoffFactor, attempt - 1);
                    setTimeout(execute, nextDelay);
                } else {
                    reject(error);  // If all retries fail, reject with the last error
                }
            }
        };

        execute();
    });
}

async function fetchData(): Promise<string> {
    // Simulate an operation that might fail
    if (Math.random() > 0.7) {
        return "Data fetched successfully!";
    } else {
        throw new Error("Failed to fetch data");
    }
}

retryAsync(fetchData, 5, 500, 2)
    .then(result => console.log(result))
    .catch(error => console.error("All retries failed:", error));
