import App, { Container } from "next/app";
import "normalize.css";
import "antd/dist/antd.css";
import { Helmet } from "react-helmet";
import { SettingProvider } from "@providers/setting";
import "./reset.scss";

class MyApp extends App {
  state: {
    setting: any;
  } = {
    setting: {}
  };

  componentDidMount() {
    SettingProvider.getSetting().then(res => {
      this.setState({ setting: res });
    });
  }

  render() {
    const {
      systemTitle,
      systemFavicon,
      seoKeyword,
      seoDesc
    } = this.state.setting;
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Helmet>
          <title>{systemTitle}</title>
          <meta name="keyword" content={seoKeyword} />
          <meta name="description" content={seoDesc} />
          <link rel="shortcut icon" href={systemFavicon} />
        </Helmet>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
