/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:10
 * @Desscription:
 */
import defaultSettings from "@/settings";

const title = defaultSettings.title || "Vue Element Admin";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
