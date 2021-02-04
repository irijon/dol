import React, { useState } from "react";
import "./App.css";

import { Auth } from "./api/firebase";

import { Menu, Segment } from "semantic-ui-react";

import { AuthForm } from "./pages/Auth/Auth";

import {
  Group,
  Speciality,
  Qualification,
  FormEducation,
} from "./pages/Tables";

import "semantic-ui-css/semantic.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

function NavItem(props) {
  let location = useLocation();

  return (
    <Menu.Item
      style={{ fontWeight: 400 }}
      name={props.name}
      active={props.to === location.pathname}
      content={
        <Link
          style={{
            fontWeight: 400,
            padding: ".85714286em 1.14285714em",
            margin: "-.85714286em -1.14285714em",
          }}
          to={props.to}
        >
          {props.children}
        </Link>
      }
    />
  );
}

function App() {
  Auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("App -> user", user);
    } else {
      console.log("App -> NO user", user);
    }
  });

  return (
    <Router>
      <div>
        <Segment style={{padding: '0px', borderRadius: '0px'}}>
          <Menu pointing secondary>
            <NavItem name="" to="/">
              Главная
            </NavItem>
            <NavItem name="groups" to="/groups">
              Группы
            </NavItem>
            <NavItem name="speciality" to="/speciality">
              Направления подготовки
            </NavItem>
            <NavItem name="qualification" to="/qualification">
              Квадификация
            </NavItem>
            <NavItem name="formEducation" to="/formEducation">
              Формы обучения
            </NavItem>
            <Menu.Menu position='right'>
            <Menu.Item>
              
            </Menu.Item>
          </Menu.Menu>
          </Menu>
        </Segment>

        <Switch>
          <Route path="/speciality">
            <div key={"1"}>
              <Speciality />
            </div>
          </Route>
          <Route path="/qualification">
            <div key={"2"}>
              <Qualification />
            </div>
          </Route>
          <Route path="/formEducation">
            <div key={"3"}>
              <FormEducation />
            </div>
          </Route>
          <Route path="/groups">
            <div key={"4"}>
              <Group />
            </div>
          </Route>
          <Route path="/">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={"5"}
            >
              <AuthForm></AuthForm>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
