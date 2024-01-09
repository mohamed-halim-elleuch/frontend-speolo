import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./views/App";
import reportWebVitals from "./reportWebVitals";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import LngDetector from "i18next-browser-languagedetector";
import translation_fr from "./translations/fr.json";
import translation_en from "./translations/en.json";
import Backend from "i18next-http-backend";
import { StyledEngineProvider } from "@mui/joy/styles";
import { ActiveContentProvider } from "./apis/ActiveContentContext";
import "leaflet/dist/leaflet.css";
i18next
  .use(LngDetector)
  .use(Backend)
  .init({
    debug: true,
    interpolation: { escapeValue: false }, // React already does escaping
    //lng: "fr", // language to use
    fallbackLng: "en",
    saveMissing: true, // If translation key is missing, which lang use instead
    resources: {
      en: {
        translation: translation_en, // 'translation' is our custom namespace
      },
      fr: {
        translation: translation_fr,
      },
    },
    detection: {
      lookupQuerystring: "lng",
    },
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <React.Suspense fallback="loading..">
        <I18nextProvider i18n={i18next}>
          <ActiveContentProvider>
            <App />
          </ActiveContentProvider>
        </I18nextProvider>
      </React.Suspense>
    </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
