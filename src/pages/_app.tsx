import { Header } from "../components/Header/index-header";
import { Player } from "../components/Player/index-player";
import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { PlayerContextProvider } from "../contexts/PlayerContext";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
