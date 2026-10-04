
function deepEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;

  if (
    objA === null ||
    objB === null ||
    typeof objA !== "object" ||
    typeof objB !== "object"
  ) {
    return false;
  }

  if (Array.isArray(objA) !== Array.isArray(objB)) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    key =>
      Object.hasOwn(objB, key) &&
      deepEqual(objA[key], objB[key])
  );
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })); // false
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 }));                     // false



function diffObjects(oldObj, newObj) {
  const added = {};
  const removed = {};
  const changed = {};

  const oldKeys = new Set(Object.keys(oldObj));
  const newKeys = new Set(Object.keys(newObj));

  for (const key of newKeys) {
    if (!oldKeys.has(key)) {
      added[key] = newObj[key];
    } else if (!Object.is(oldObj[key], newObj[key])) {
      changed[key] = {
        from: oldObj[key],
        to: newObj[key]
      };
    }
  }

  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      removed[key] = oldObj[key];
    }
  }

  return { added, removed, changed };
}

console.log(
  diffObjects(
    { name: "Setemi", role: "Engineer", country: "Jamaica" },
    { name: "Setemi", role: "Senior Engineer", city: "Kingston" }
  )
);
// {
//   added: { city: "Kingston" },
//   removed: { country: "Jamaica" },
//   changed: { role: { from: "Engineer", to: "Senior Engineer" } }
// }



function deepFreeze(obj, seen = new WeakSet()) {
  if (
    obj === null ||
    (typeof obj !== "object" && typeof obj !== "function")
  ) {
    return obj;
  }

  if (seen.has(obj)) {
    return obj;
  }
  seen.add(obj);

  Object.freeze(obj);

  for (const value of Object.values(obj)) {
    deepFreeze(value, seen);
  }

  return obj;
}

const config = deepFreeze({
  api: { baseUrl: "https://x.com", retries: 3 },
  debug: false
});

config.api.baseUrl = "https://changed.com"; // ignored
config.debug = true;                        // ignored

console.log(config.api.baseUrl, config.debug); // "https://x.com" false
console.log(Object.isFrozen(config.api));      // true



function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    get value() {
      return count;
    }
  };
}

const counter = createCounter();

counter.increment();
counter.increment();
counter.decrement();

console.log(counter.value); // 1
console.log(counter.count); // undefined


function createCounter() {
  let count = 0; // Private: only these methods can access it

  return {
    increment() {
      count += 1;
    },

    decrement() {
      count -= 1;
    },

    get value() {
      return count;
    }
  };
}

const counter = createCounter();

counter.increment();
counter.increment();
counter.decrement();

console.log(counter.value); // 1
console.log(counter.count); // undefined