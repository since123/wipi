import App from "next/app";
import { ViewProvider } from "@providers/view";
import { PageTransition } from "next-page-transitions";
import "@/theme/antd.less";
import "@/theme/reset.scss";
import "@/theme/markdown.scss";

let lastUrl;

const addView = url => {
  if (/admin/.test(url)) {
    return;
  }

  ViewProvider.addView({ url });
};

class MyApp extends App {
  componentDidMount() {
    try {
      const el = document.querySelector("#holderStyle");
      el.parentNode.removeChild(el);
    } catch (e) {}

    const url = window.location.href;
    lastUrl = url;
    addView(url);
  }

  componentDidUpdate() {
    const url = window.location.href;

    if (url === lastUrl) {
      return;
    }

    lastUrl = url;
    addView(url);
  }

  render() {
    const { Component, pageProps, router } = this.props;
    // const pathname = router.pathname;
    // const isAdmin = /admin/.test(pathname);

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
        {/* {isAdmin ? (
          <Component {...pageProps} />
        ) : (
          <PageTransition
            timeout={250}
            classNames="page-transition"
            loadingComponent={null}
            loadingDelay={500}
            loadingTimeout={{
              enter: 250,
              exit: 0
            }}
          >
            <Component {...pageProps} />
          </PageTransition>
        )} */}
        <Component {...pageProps} />
      </div>
    );
  }
}

export default MyApp;
