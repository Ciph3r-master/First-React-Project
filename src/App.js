import { useRef } from "react";
import Button from "./Button";
import MineSweeper from "./MineSweeper";

function App() {

  const gameRef = useRef(null)
  const executeScroll = () => gameRef.current.scrollIntoView()  

  return (
    <div className="App">

      <header>

        <h1>Bienvenue chez moi</h1>

        <Button label="Mes jeux" onClick={executeScroll}/>
      </header>

      <section id="duel">

        <h2>Voulez-vous me défier ?</h2>


        <div ref={gameRef} className="games">
          <MineSweeper params={{x: 10, y: 10, bombs: 10}} />
        </div>

      </section>


    </div>
  );
}

export default App;
