import App, { Container } from "next/app";
import { Helmet } from "react-helmet";
import { SettingProvider } from "@providers/setting";
import "antd/dist/antd.css";
import "@/theme/reset.scss";
import "@/theme/markdown.scss";

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
          <link
            href="//fonts.googleapis.com/css?family=Nunito:400,400i,700,700i&amp;display=swap"
            rel="stylesheet"
          ></link>
        </Helmet>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
