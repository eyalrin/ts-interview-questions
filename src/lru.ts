class ItemNode<T> {
    public next: ItemNode<T> | null = null;
    public prev: ItemNode<T> | null = null;

    constructor(public value: T) {}
}

class LRUCache<T> {
    private capacity: number;
    private size: number;
    private head: ItemNode<T> | null = null;
    private tail: ItemNode<T> | null = null;
    private nodeMap = new Map<T, ItemNode<T>>(); // To keep track of each node for quick removal

    constructor(capacity: number) {
        this.capacity = capacity;
        this.size = 0;
    }

    add(value: T): void {
        // If the value is already in the cache, move it to the front
        const existingNode = this.nodeMap.get(value);
        if (existingNode) {
            this.moveToFront(existingNode);
            return;
        }

        // If at capacity, remove the least recently used item (tail)
        if (this.size >= this.capacity) {
            this.removeLeastRecentlyUsed();
        }

        // Add the new value to the front
        const newNode = new ItemNode(value);
        this.addToFront(newNode);
        this.size++;
        this.nodeMap.set(value, newNode);
    }

    // Helper function to add a node to the front of the list
    private addToFront(node: ItemNode<T>): void {
        if (!this.head) {
            this.head = this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
    }

    // Helper function to move an existing node to the front
    private moveToFront(node: ItemNode<T>): void {
        if (node === this.head) return; // Already at the front

        // Remove the node from its current position
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;

        if (node === this.tail) {
            this.tail = node.prev;
        }

        // Move it to the front
        node.next = this.head;
        node.prev = null;
        if (this.head) this.head.prev = node;
        this.head = node;
    }

    // Helper function to remove the least recently used item (from the tail)
    private removeLeastRecentlyUsed(): void {
        if (!this.tail) return;

        const lruValue = this.tail.value;
        this.size--;
        this.nodeMap.delete(lruValue);

        // Adjust the tail pointer
        this.tail = this.tail.prev;
        if (this.tail) {
            this.tail.next = null;
        } else {
            this.head = null; // List is now empty
        }
    }


    // Optional: Get all values in cache (from most recent to least recent)
    getValues(): T[] {
        const values: T[] = [];
        let current = this.head;
        while (current) {
            values.push(current.value);
            current = current.next;
        }
        return values;
    }
}

const cache = new LRUCache<number>(3);
cache.add(1);
cache.add(2);
cache.add(3);
console.log(cache.getValues()); // [3, 2, 1]
cache.add(4);
console.log(cache.getValues()); // [4, 3, 2] (1 is removed as it's the least recently used)
cache.add(2);
console.log(cache.getValues()); // [2, 4, 3] (2 is now the most recent)
