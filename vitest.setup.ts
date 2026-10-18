import "@testing-library/jest-dom/vitest";

// jsdom has no IntersectionObserver; stub it for the infinite-scroll sentinel.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserverStub }).IntersectionObserver =
  IntersectionObserverStub;
