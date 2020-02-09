import App from "next/app";
import "antd/dist/antd.less";
import "@/theme/antd.less";
import "@/theme/reset.scss";
import "@/theme/markdown.scss";

class MyApp extends App {
  componentDidMount() {
    try {
      const el = document.querySelector("#holderStyle");
      el.parentNode.removeChild(el);
    } catch (e) {}
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <div>
        <style
          id="holderStyle"
          dangerouslySetInnerHTML={{
            __html: ` * {
      transition: none !important;
    }`
          }}
        ></style>
        <Component {...pageProps} />
      </div>
    );
  }
}

export default MyApp;
