import React from "react";
import { NewSlidesLayout } from "@/components/entrypoint-layouts/new-slides-layout";
import { Preloader } from "@/components/preloader";
import { SlideNav } from "@/components/slide-nav";
import { faces } from "@/faces.config.json";
import FaceuqqcriFace from "@/faces/face-uqqcri/face.tsx";
import Facek3m7qdFace from "@/faces/face-k3m7qd/face.tsx";
import FacevmmwjkFace from "@/faces/face-vmmwjk/face.tsx";
import Faceqvqt48Face from "@/faces/face-qvqt48/face.tsx";
import Facedzd1rqFace from "@/faces/face-dzd1rq/face.tsx";
import FacelandingFace from "@/faces/face-landing/face.tsx";
import Face0r58ngFace from "@/faces/face-0r58ng/face.tsx";
import Face1ecenbFace from "@/faces/face-1ecenb/face.tsx";
import Face8uelwyFace from "@/faces/face-8uelwy/face.tsx";
import Face9sa50dFace from "@/faces/face-9sa50d/face.tsx";
import Facer3r76iFace from "@/faces/face-r3r76i/face.tsx";
import Facenqw26vFace from "@/faces/face-nqw26v/face.tsx";
import FacetryoutFace from "@/faces/face-tryout/face.tsx";
import Faceywfin7Face from "@/faces/face-ywfin7/face.tsx";
const visibleFaces = faces.filter((face) => !face.hidden);

export const componentMap = {
  "face-uqqcri": FaceuqqcriFace,
  "face-k3m7qd": Facek3m7qdFace,
  "face-vmmwjk": FacevmmwjkFace,
  "face-qvqt48": Faceqvqt48Face,
  "face-dzd1rq": Facedzd1rqFace,
  "face-landing": FacelandingFace,
  "face-0r58ng": Face0r58ngFace,
  "face-1ecenb": Face1ecenbFace,
  "face-8uelwy": Face8uelwyFace,
  "face-9sa50d": Face9sa50dFace,
  "face-r3r76i": Facer3r76iFace,
  "face-nqw26v": Facenqw26vFace,
  "face-tryout": FacetryoutFace,
  "face-ywfin7": Faceywfin7Face,
};

export const projectConfig = {"layout":"STACKED","slidesDisplay":"FULLSCREEN","stackedOrientation":"HORIZONTAL","cardsBackgroundColor":"#050b14","cardsCorners":"SQUARE","mobileCanvas":"COMPACT","tokens":{"palette":[{"name":"--background","value":"#080B10"},{"name":"--panel","value":"#131A22"},{"name":"--border","value":"#1E2731"},{"name":"--cyan","value":"#A6E86B"},{"name":"--cyan-bright","value":"#B7F27D"},{"name":"--green","value":"#7ED957"},{"name":"--red","value":"#F0645B"},{"name":"--navy-0","value":"#080B10"},{"name":"--navy-1","value":"#0D1219"},{"name":"--navy-2","value":"#111820"},{"name":"--navy-3","value":"#161E27"},{"name":"--navy-4","value":"#1C2530"},{"name":"--line","value":"#1E2731"},{"name":"--hairline","value":"#1C2530"},{"name":"--blue","value":"#24303C"},{"name":"--ice","value":"#F2F6F9"},{"name":"--body","value":"#C2CCD6"},{"name":"--steel","value":"#6B7885"},{"name":"--muted","value":"#8593A1"},{"name":"--violet","value":"#7C8FA3"},{"name":"--amber","value":"#9AA7B4"},{"name":"--signal","value":"#F2A33C"}],"fonts":[{"name":"--font-display","family":"Plus Jakarta Sans"},{"name":"--font-body","family":"Inter"},{"name":"--font-mono","family":"IBM Plex Mono"},{"name":"--font-pixel","family":"Silkscreen"},{"name":"--font-condensed","family":"Roboto Condensed"},{"name":"--font-grotesk","family":"Archivo"},{"name":"--font-terminal","family":"Archivo"}]}};

export default function Page() {
  return (
    <>
      <NewSlidesLayout
        faces={visibleFaces}
        componentMap={componentMap}
        layout="STACKED"
        slidesDisplay="FULLSCREEN"
        stackedOrientation="HORIZONTAL"
        cardsSlidesPerView={1}
        cardsBackgroundColor={"#050b14"}
        cardsBackgroundImage={""}
        cardsCorners="SQUARE"
        mobileCanvas="COMPACT"
      />
      <SlideNav />
      <Preloader />
    </>
  );
}
