import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { ContactMessagesProvider } from "./context/ContactMessagesContext.tsx";

// PWA registration
import { registerSW } from "virtual:pwa-register";

// Register service worker with update handling
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ContactMessagesProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ContactMessagesProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
