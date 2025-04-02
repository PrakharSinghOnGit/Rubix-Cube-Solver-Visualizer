module.exports = {
  theme: {
    extend: {
      keyframes: {
        prog: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        prog: "prog var(--duration, 2s) linear forwards",
      },
    },
  },
  plugins: [],
};