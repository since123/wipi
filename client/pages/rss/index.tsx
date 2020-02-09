import React from "react";
import { NextPage } from "next";
import RSS from "@/rss/index.js";
import { ArticleProvider } from "@providers/article";
import { SettingProvider } from "@providers/setting";
import { TagProvider } from "@providers/tag";
const url = require("url");

const Rss: NextPage = () => {
  return null;
};

// 服务端预取数据
Rss.getInitialProps = async ctx => {
  const { res } = ctx;

  res.setHeader("Content-Type", "text/xml");

  const [articles, setting, tags] = await Promise.all([
    ArticleProvider.getArticles(true),
    SettingProvider.getSetting(),
    TagProvider.getTags()
  ]);

  const feed = new RSS({
    title: setting.systemTitle,
    description: setting.seoDesc,
    feed_url: url.resolve(setting.systemUrl, "rss"),
    site_url: setting.systemUrl,
    author: "https://github.com/zhxuc",
    categories: tags.map(tag => tag.label)
  });

  articles.forEach(article => {
    feed.item({
      title: article.title,
      description: article.summary,
      url: url.resolve(setting.systemUrl, "article/" + article.id),
      date: article.updateAt,
      categories: (article.tags || []).map(tag => tag.label)
    });
  });

  res.write(feed.xml());
  res.end();
};

export default Rss;
