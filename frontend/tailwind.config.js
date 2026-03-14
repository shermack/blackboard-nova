export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        mist: "#f6fbff",
        glow: "#7dd3fc",
        coral: "#ff7a59",
        mint: "#5eead4"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(7, 17, 31, 0.18)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(125,211,252,0.24), transparent 28%), radial-gradient(circle at 80% 10%, rgba(255,122,89,0.24), transparent 22%), linear-gradient(135deg, #07111f 0%, #10264a 38%, #0f766e 100%)"
      },
      fontFamily: {
        display: ["Georgia", "ui-serif", "serif"],
        body: ["Segoe UI", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
