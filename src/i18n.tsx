import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import fr from "./locales/fr/translation.json";
import es from "./locales/es/translation.json";
import ru from "./locales/ru/translation.json";
import nl from "./locales/nl/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import pl from "./locales/pl/translation.json";
import pt from "./locales/pt/translation.json";
import sr from "./locales/sr/translation.json";
import tr from "./locales/tr/translation.json";
import uk from "./locales/uk/translation.json";
import ar from "./locales/ar/translation.json";
import zh from "./locales/zh/translation.json";
import cs from "./locales/cs/translation.json";
import da from "./locales/da/translation.json";
import fi from "./locales/fi/translation.json";
import el from "./locales/el/translation.json";
import hu from "./locales/hu/translation.json";
import id from "./locales/id/translation.json";
import ja from "./locales/ja/translation.json";
import ko from "./locales/ko/translation.json";
import no from "./locales/no/translation.json";
import fa from "./locales/fa/translation.json";
import ro from "./locales/ro/translation.json";
import sv from "./locales/sv/translation.json";
import th from "./locales/th/translation.json";
import vi from "./locales/vi/translation.json";


i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    fr: { translation: fr },
    es: { translation: es },
    ru: { translation: ru },
    nl: { translation: nl },
    de: { translation: de },
    it: { translation: it },
    pl: { translation: pl },
    pt: { translation: pt },
    sr: { translation: sr },
    tr: { translation: tr },
    uk: { translation: uk },
    ar: { translation: ar },
    zh: { translation: zh },
    cs: { translation: cs },
    da: { translation: da },
    fi: { translation: fi },
    el: { translation: el },
    hu: { translation: hu },
    id: { translation: id },
    ja: { translation: ja },
    ko: { translation: ko },
    no: { translation: no },
    fa: { translation: fa },
    ro: { translation: ro },
    sv: { translation: sv },
    th: { translation: th },
    vi: { translation: vi }
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
