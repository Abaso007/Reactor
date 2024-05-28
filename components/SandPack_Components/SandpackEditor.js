"use client";

import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

const SandpackReactComponent = ({ code }) => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Sandpack
        template="react"
        files={{
          "/App.js": code,
          "/index.js": `import React from "react";
                        import { createRoot } from "react-dom/client";
                        import App from "./App";
                        import './index.css';
                        const container = document.getElementById("root");
                        const root = createRoot(container);
                        root.render(<App />);`,
          "/public/index.html": `<div id="root"></div>`,
          "/index.css": `@tailwind base;
                         @tailwind components;
                         @tailwind utilities;`,
          "/tailwind.config.js": `module.exports = {
                                    purge: [],
                                    darkMode: false,
                                    theme: {
                                      extend: {},
                                    },
                                    variants: {
                                      extend: {},
                                    },
                                    plugins: [],
                                  };`,
          "/postcss.config.js": `module.exports = {
                                  plugins: {
                                    tailwindcss: {},
                                    autoprefixer: {},
                                  },
                                };`,
          "/package.json": JSON.stringify({
            main: "/index.js",
            dependencies: {
              react: "latest",
              "react-dom": "latest",
              tailwindcss: "latest",
              autoprefixer: "latest",
              postcss: "latest",
              three: "latest",
              "@react-three/fiber": "latest",
              "@react-three/drei": "latest",
              "framer-motion": "latest",
              "date-fns": "latest",
              "framer-motion-3d": "latest"
            },
          }),
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          showTabs: true,
          showLineNumbers: true,
          wrapContent: true,
          editorHeight: 300,
        }}
      />
    </div>
  );
};

export default SandpackReactComponent;
