import { Layout } from "antd";
import React, { Component } from "react";
import styled from "styled-components";
import { StateProvider } from "./data/Provider";
import Footer from "./renderer/pages/Footer/Footer";
import Sidebar from "./renderer/pages/Sidebar/Sidebar";
import Route from "./renderer/Route";
import Modal from "./renderer/components/Modal";
import ModalList from "./renderer/pages/Modal/ModalList";

export default class App extends Component {
  render() {
    // Change Landing Page Layout here!
    return (
      <div className="App">
        <ModalList />
        <Layout style={{ minHeight: "100vh" }}>
          <Layout>
            <Styled.Sider collapsedWidth={80} breakpoint="lg">
              <Sidebar mode="vertical" />
            </Styled.Sider>
            <Route />
          </Layout>
          <Styled.Footer>
            <Footer />
          </Styled.Footer>
        </Layout>
      </div>
    );
  }
}

const Styled = {
  Sider: styled(Layout.Sider)`
    background: white;
  `,
  Footer: styled(Layout.Footer)`
    padding: 0;
    background: white;
  `,
};
