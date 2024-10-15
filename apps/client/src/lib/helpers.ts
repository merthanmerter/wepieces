function str(str: string) {
  return {
    capitalizeFirst: function () {
      str = str.charAt(0).toUpperCase() + str.slice(1);
      return this;
    },
    capitalizeAll: function () {
      str = str.replace(/(^\w)|(\s\w)/g, ($1) => $1.toUpperCase());
      return this;
    },
    lower: function () {
      str = str.toLowerCase();
      return this;
    },
    upper: function () {
      str = str.toUpperCase();
      return this;
    },
    trim: function () {
      str = str.trim();
      return this;
    },
    kebab: function () {
      str = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      return this;
    },
    snake: function () {
      str = str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
      return this;
    },
    camel: function () {
      str = str.replace(/([-_][a-z])/g, ($1) => {
        return $1.toUpperCase().replace("-", "").replace("_", "");
      });
      return this;
    },
    truncate: function (length: number, truncateString = "...") {
      if (str.length <= length) return str;
      return str.substring(0, length) + truncateString;
    },
    removeWhitespace: function () {
      str = str.replace(/\s+/g, "");
      return this;
    },
    reverse: function () {
      str = str.split("").reverse().join("");
      return this;
    },
    wordCount: function () {
      return str.trim().split(/\s+/).length;
    },
    slugify: function () {
      str = str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return this;
    },
    isPalindrome: function () {
      const cleaned = str.replace(/[\W_]/g, "").toLowerCase();
      return cleaned === cleaned.split("").reverse().join("");
    },
    value: function () {
      return str;
    },
  };
}

function num(num: number) {
  return {
    clamp: function (min: number, max: number) {
      return Math.min(Math.max(num, min), max);
    },
    random: function (min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    negative: function () {
      return num < 0;
    },
    positive: function () {
      return num > 0;
    },
    toNegative: function () {
      return num * -1;
    },
    toPositive: function () {
      return num * -1;
    },
    toFixed: function (decimals: number) {
      return Number(`${Math.round(Number(`${num}e${decimals}`))}e-${decimals}`);
    },
    round: function (decimals: number) {
      return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    abs: function () {
      return Math.abs(num);
    },
    ceil: function () {
      return Math.ceil(num);
    },
    floor: function () {
      return Math.floor(num);
    },
    sign: function () {
      return Math.sign(num);
    },
    value: function () {
      return num;
    },
  };
}

function arr(arr: any[]) {
  return {
    first: function () {
      return arr[0];
    },
    last: function () {
      return arr[arr.length - 1];
    },
    random: function () {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    unique: function () {
      return [...new Set(arr)];
    },
    flatten: function () {
      return arr.reduce((acc, val) => acc.concat(val), []);
    },
    chunk: function (size: number) {
      const chunks: any[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    },
    value: function () {
      return arr;
    },
  };
}

function obj(obj: Record<string, any>) {
  return {
    deepMerge: function (source: Record<string, any>) {
      const merge = (target: Record<string, any>, src: Record<string, any>) => {
        for (const key in src) {
          if (src[key] instanceof Object && !Array.isArray(src[key])) {
            target[key] = merge(target[key] || {}, src[key]);
          } else {
            target[key] = src[key];
          }
        }
        return target;
      };
      return merge(obj, source);
    },
    omit: function (keys: string[]) {
      const newObj = { ...obj };
      keys.forEach((key) => delete newObj[key]);
      return newObj;
    },
    pick: function (keys: string[]) {
      const newObj: Record<string, any> = {};
      keys.forEach((key) => {
        if (obj[key] !== undefined) newObj[key] = obj[key];
      });
      return newObj;
    },
    isEmpty: function () {
      return Object.keys(obj).length === 0;
    },
    value: function () {
      return obj;
    },
  };
}

function fn(fn: Function) {
  return {
    debounce: function (delay: number) {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    },
    throttle: function (limit: number) {
      let inThrottle = false;
      return (...args: any[]) => {
        if (!inThrottle) {
          fn(...args);
          inThrottle = true;
          setTimeout(() => {
            inThrottle = false;
          }, limit);
        }
      };
    },
    memoize: function () {
      const cache: { [key: string]: any } = {};
      return (...args: any[]) => {
        const key = JSON.stringify(args);
        if (!cache[key]) {
          cache[key] = fn(...args);
        }
        return cache[key];
      };
    },
    value: function () {
      return fn;
    },
  };
}

function date(date: Date) {
  return {
    format: function (separator = "-") {
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(
        separator,
      );
    },
    daysBetween: function (otherDate: Date) {
      const diffTime = Math.abs(otherDate.getTime() - date.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    addDays: function (days: number) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    addMonths: function (months: number) {
      const result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
    },
    addYears: function (years: number) {
      const result = new Date(date);
      result.setFullYear(result.getFullYear() + years);
      return result;
    },
    value: function () {
      return date;
    },
  };
}

export function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (initialValue: T): T => fns.reduce((acc, fn) => fn(acc), initialValue);
}

export default {
  str,
  num,
  arr,
  obj,
  fn,
  date,
  pipe,
};
