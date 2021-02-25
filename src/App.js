import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { normalTheme } from "./themes/purple";
import { darkTheme } from "./themes/dark";
import { useEffect, useState } from "react";
import db from "./firebase";

function App() {
  const stored = localStorage.getItem("isDarkMode");
  const [isDarkMode, setIsDarkMode] = useState(
    stored === "true" ? true : false
  );

  function handleClick() {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode);
  }

  const [rooms, setRooms] = useState([]);

  const getChannels = () => {
    db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => {
          return { id: doc.id, name: doc.data().name };
        })
      );
    });
  };

  useEffect(() => {
    console.log(process.env);
    getChannels();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={isDarkMode ? darkTheme : normalTheme}>
        <Router>
          <Container>
            <Header runClick={handleClick} />
            <Main>
              <Sidebar rooms={rooms} />
              <Switch>
                <Route path="/room">
                  <Chat />
                </Route>
                <Route path="/">
                  <Login />
                </Route>
              </Switch>
            </Main>
          </Container>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 38px auto;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: 260px auto;
`;
