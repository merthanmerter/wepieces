interface ProgressSettings {
  minimum: number;
  easing: string;
  positionUsing: string;
  speed: number;
  trickle: boolean;
  trickleRate: number;
  trickleSpeed: number;
  barSelector: string;
  parent: string;
  template: string;
}

interface Progress {
  version: string;
  settings: ProgressSettings;
  configure: (options: Partial<ProgressSettings>) => Progress;
  status: number | null;
  set: (n: number) => Progress;
  isStarted: () => boolean;
  start: () => Progress;
  done: (force?: boolean) => Progress;
  inc: (amount?: number) => Progress;
  trickle: () => Progress;
  promise: (promise: Promise<unknown>) => Progress;
  render: (fromStart?: boolean) => HTMLElement;
  remove: () => void;
  isRendered: () => boolean;
  getPositioningCSS: () => string;
}

const Progress: Progress = {
  version: "wepieces-custom",
  settings: {
    minimum: 0.08,
    easing: "ease",
    positionUsing: "",
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    barSelector: '[role="bar"]',
    parent: "body",
    template: '<div class="bar" role="bar"><div class="peg"></div></div>',
  },
  status: null,

  configure(options) {
    Object.assign(this.settings, options);
    return this;
  },

  set(n) {
    const started = this.isStarted();

    n = clamp(n, this.settings.minimum, 1);
    this.status = n === 1 ? null : n;

    const progress = this.render(!started);
    const bar = progress.querySelector(
      this.settings.barSelector,
    ) as HTMLElement;
    const speed = this.settings.speed;
    const ease = this.settings.easing;

    progress.offsetWidth; // Repaint

    queue((next) => {
      if (this.settings.positionUsing === "")
        this.settings.positionUsing = this.getPositioningCSS();

      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        css(progress, { transition: "none", opacity: 1 });
        progress.offsetWidth; // Repaint

        setTimeout(() => {
          css(progress, { transition: `all ${speed}ms linear`, opacity: 0 });
          setTimeout(() => {
            this.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  },

  isStarted() {
    return typeof this.status === "number";
  },

  start() {
    if (!this.status) this.set(0);

    const work = () => {
      setTimeout(() => {
        if (!this.status) return;
        this.trickle();
        work();
      }, this.settings.trickleSpeed);
    };

    if (this.settings.trickle) work();

    return this;
  },

  done(force = false) {
    if (!force && !this.status) return this;
    return this.inc(0.3 + 0.5 * Math.random()).set(1);
  },

  inc(amount) {
    let n = this.status;
    if (!n) {
      return this.start();
    } else {
      if (typeof amount !== "number") {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return this.set(n);
    }
  },

  trickle() {
    return this.inc(Math.random() * this.settings.trickleRate);
  },

  promise(promise) {
    let initial = 0;
    let current = 0;

    if (!promise) {
      return this;
    }

    if (current === 0) {
      this.start();
    }

    initial++;
    current++;

    promise.finally(() => {
      current--;
      if (current === 0) {
        initial = 0;
        this.done();
      } else {
        this.set((initial - current) / initial);
      }
    });

    return this;
  },

  render(fromStart = false) {
    if (this.isRendered()) return document.getElementById("progress")!;

    addClass(document.documentElement, "progress-busy");

    const progress = document.createElement("div");
    progress.id = "progress";
    progress.innerHTML = this.settings.template;

    const bar: HTMLElement = progress.querySelector(this.settings.barSelector)!;
    const percentage = fromStart ? "-100" : toBarPercentage(this.status || 0);
    const parent: HTMLElement = document.querySelector(this.settings.parent)!;

    css(bar, {
      transition: "all 0 linear",
      transform: `translate3d(${percentage}%,0,0)`,
    });

    if (parent !== document.body) {
      addClass(parent, "progress-custom-parent");
    }

    parent.appendChild(progress);
    return progress;
  },

  remove() {
    removeClass(document.documentElement, "progress-busy");
    removeClass(
      document.querySelector(this.settings.parent)!,
      "progress-custom-parent",
    );
    const progress = document.getElementById("progress");
    progress && removeElement(progress);
  },

  isRendered() {
    return !!document.getElementById("progress");
  },

  getPositioningCSS() {
    const bodyStyle = document.body.style;
    const vendorPrefix =
      "WebkitTransform" in bodyStyle
        ? "Webkit"
        : "MozTransform" in bodyStyle
          ? "Moz"
          : "msTransform" in bodyStyle
            ? "ms"
            : "OTransform" in bodyStyle
              ? "O"
              : "";

    if (vendorPrefix + "Perspective" in bodyStyle) {
      return "translate3d";
    } else if (vendorPrefix + "Transform" in bodyStyle) {
      return "translate";
    } else {
      return "margin";
    }
  },
};

// Utility functions

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

function toBarPercentage(n: number): number {
  return (-1 + n) * 100;
}

function barPositionCSS(n: number, speed: number, ease: string) {
  const position = Progress.settings.positionUsing;
  const transform =
    position === "translate3d"
      ? `translate3d(${toBarPercentage(n)}%,0,0)`
      : position === "translate"
        ? `translate(${toBarPercentage(n)}%,0)`
        : { "margin-left": `${toBarPercentage(n)}%` };

  return {
    transform,
    transition: `all ${speed}ms ${ease}`,
  };
}

function css(element: HTMLElement, properties: Record<string, any>) {
  Object.keys(properties).forEach((prop) => {
    element.style[prop as any] = properties[prop];
  });
}

function addClass(element: HTMLElement, className: string) {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

function removeClass(element: HTMLElement, className: string) {
  element.classList.remove(className);
}

function removeElement(element: HTMLElement) {
  element && element.parentNode?.removeChild(element);
}

function queue(fn: (next: () => void) => void) {
  const pending: Array<(next: () => void) => void> = [];

  function next() {
    const fn = pending.shift();
    if (fn) fn(next);
  }

  pending.push(fn);
  if (pending.length === 1) next();
}

export default Progress;
