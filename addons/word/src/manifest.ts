/**
 * The Office add-in manifest (XML), generated at build time so the name, URLs and
 * translated description come from the brand and locale files.
 */
import { BRAND, escapeHTML } from "@fita/core";
import { MANIFEST_LOCALES, MESSAGES } from "./i18n.js";

/** Fixed add-in ID: Office identifies the add-in by it, so it must never change. */
export const ADDIN_ID = "0f6c1d4e-6a49-4c5e-9d0b-3b7f2a8e51c4";
/** Where the task pane is served: the project's static website. */
export const BASE_URL = `${BRAND.website}/addins/word/`;

const x = escapeHTML;

function overrides(key: "description"): string {
  return Object.entries(MESSAGES)
    .filter(([lang]) => lang !== "en")
    .map(
      ([lang, m]) =>
        `<Override Locale="${MANIFEST_LOCALES[lang as keyof typeof MESSAGES]}" Value="${x(m[key])}"/>`,
    )
    .join("");
}

/** Office wants a four-part version. */
export function officeVersion(version: string): string {
  const parts = version.split(".").map((p) => String(Number.parseInt(p, 10) || 0));
  while (parts.length < 4) parts.push("0");
  return parts.slice(0, 4).join(".");
}

export function manifest(version: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:type="TaskPaneApp">
  <Id>${ADDIN_ID}</Id>
  <Version>${officeVersion(version)}</Version>
  <ProviderName>${x(BRAND.name)}</ProviderName>
  <DefaultLocale>${MANIFEST_LOCALES.en}</DefaultLocale>
  <DisplayName DefaultValue="${x(BRAND.name)}"/>
  <Description DefaultValue="${x(MESSAGES.en.description)}">${overrides("description")}</Description>
  <IconUrl DefaultValue="${BASE_URL}icon-32.png"/>
  <HighResolutionIconUrl DefaultValue="${BASE_URL}icon-128.png"/>
  <SupportUrl DefaultValue="${x(BRAND.repository)}/issues"/>
  <Hosts>
    <Host Name="Document"/>
  </Hosts>
  <Requirements>
    <Sets DefaultMinVersion="1.1">
      <Set Name="WordApi" MinVersion="1.5"/>
    </Sets>
  </Requirements>
  <DefaultSettings>
    <SourceLocation DefaultValue="${BASE_URL}taskpane.html"/>
  </DefaultSettings>
  <Permissions>ReadWriteDocument</Permissions>
</OfficeApp>
`;
}
