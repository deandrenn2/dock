// vite.config.ts
import { defineConfig } from "file:///D:/LAB/LIBRARIES/button-ui/node_modules/.pnpm/vite@5.3.0_@types+node@25.9.3/node_modules/vite/dist/node/index.js";
import react from "file:///D:/LAB/LIBRARIES/button-ui/node_modules/.pnpm/@vitejs+plugin-react@4.3.0_vite@5.3.0_@types+node@25.9.3_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///D:/LAB/LIBRARIES/button-ui/node_modules/.pnpm/vite-plugin-dts@4.5.4_@type_925bfffae0dbb3e0cd4d09adfcefaca5/node_modules/vite-plugin-dts/dist/index.mjs";
import cssInjectedByJs from "file:///D:/LAB/LIBRARIES/button-ui/node_modules/.pnpm/vite-plugin-css-injected-by_ebb8647ef126368ceb46450d54e93b56/node_modules/vite-plugin-css-injected-by-js/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\LAB\\LIBRARIES\\button-ui\\packages\\core";
var vite_config_default = defineConfig({
  plugins: [react(), dts({ include: ["src"], rollupTypes: true }), cssInjectedByJs()],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxMQUJcXFxcTElCUkFSSUVTXFxcXGJ1dHRvbi11aVxcXFxwYWNrYWdlc1xcXFxjb3JlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxMQUJcXFxcTElCUkFSSUVTXFxcXGJ1dHRvbi11aVxcXFxwYWNrYWdlc1xcXFxjb3JlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9MQUIvTElCUkFSSUVTL2J1dHRvbi11aS9wYWNrYWdlcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IGNzc0luamVjdGVkQnlKcyBmcm9tICd2aXRlLXBsdWdpbi1jc3MtaW5qZWN0ZWQtYnktanMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGR0cyh7IGluY2x1ZGU6IFsnc3JjJ10sIHJvbGx1cFR5cGVzOiB0cnVlIH0pLCBjc3NJbmplY3RlZEJ5SnMoKV0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ10sXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYGluZGV4LiR7Zm9ybWF0ID09PSAnZXMnID8gJ2pzJyA6ICdjanMnfWAsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3QvanN4LXJ1bnRpbWUnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXG4gICAgICAgICAgJ3JlYWN0LWRvbSc6ICdSZWFjdERPTScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGV4dGVuc2lvbnM6IFsnLnRzJywgJy50c3gnLCAnLm1qcycsICcuanMnLCAnLmpzeCcsICcuanNvbiddLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsU0FBUyxvQkFBb0I7QUFDblYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLHFCQUFxQjtBQUM1QixTQUFTLGVBQWU7QUFKeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsU0FBUyxDQUFDLEtBQUssR0FBRyxhQUFhLEtBQUssQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0FBQUEsRUFDbEYsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsU0FBUyxXQUFXLE9BQU8sT0FBTyxLQUFLO0FBQUEsSUFDL0Q7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxTQUFTLGFBQWEsbUJBQW1CO0FBQUEsTUFDcEQsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsT0FBTztBQUFBLFVBQ1AsYUFBYTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxZQUFZLENBQUMsT0FBTyxRQUFRLFFBQVEsT0FBTyxRQUFRLE9BQU87QUFBQSxFQUM1RDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
