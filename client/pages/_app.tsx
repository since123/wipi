import App from "next/app";
import { SettingProvider as SettingApi } from "@/providers/setting";
import { Provider as SettingProvider } from "@/hooks/useSetting";
import { PageProvider as PageApi } from "@providers/page";
import { Provider as MenusProvider, defaultMenus } from "@/hooks/useMenus";
import "antd/dist/antd.css";
import "@/theme/reset.scss";
import "@/theme/markdown.scss";

class MyApp extends App {
  state: {
    setting: any;
    menus: any;
  } = {
    setting: {},
    menus: defaultMenus
  };

  componentDidMount() {
    try {
      const el = document.querySelector("#holderStyle");
      el.parentNode.removeChild(el);
    } catch (e) {}

    Promise.all([SettingApi.getSetting(), PageApi.getAllPublisedPages()]).then(
      ([setting, res]) => {
        const arr = res.map(r => ({ path: `/page/` + r.path, label: r.name }));
        this.setState({ menus: [...defaultMenus, ...arr], setting });
      }
    );
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <div>
        <SettingProvider value={{ setting: this.state.setting }}>
          <MenusProvider value={{ menus: this.state.menus }}>
            <style
              id="holderStyle"
              dangerouslySetInnerHTML={{
                __html: ` * {
      transition: none !important;
    }`
              }}
            ></style>
            <Component {...pageProps} />
          </MenusProvider>
        </SettingProvider>
      </div>
    );
  }
}

export default MyApp;
