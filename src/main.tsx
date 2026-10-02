import { createRoot } from "react-dom/client";
import Page from "@/app/page";
import "@/index.css";
/* Theme last. It re-points the deck's legacy tokens at the shared space ramp,
   and `index.css` still declares the originals — at equal specificity the
   later declaration wins, so this must come after or the old palette would
   override the new one. */
import "@/styles/alethia-theme.css";

createRoot(document.getElementById("root")!).render(<Page />);
