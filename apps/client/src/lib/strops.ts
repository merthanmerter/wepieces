export default function strops(str: string) {
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
    value: function () {
      return str;
    },
  };
}
