"""UNO component behind the Writer menu.

Addons.xcu calls it with URLs like ``service:<implementation>?document``; LibreOffice
then calls ``trigger("document")``. Everything happens locally in the open document.
"""

import os

import uno
import unohelper
from com.sun.star.awt.MessageBoxButtons import BUTTONS_OK
from com.sun.star.awt.MessageBoxType import INFOBOX
from com.sun.star.task import XJobExecutor
from wordanchor import brand, i18n, settings, writer


def ui_locale(ctx) -> str:
    try:
        provider = ctx.getServiceManager().createInstanceWithContext(
            "com.sun.star.configuration.ConfigurationProvider", ctx
        )
        node = uno.createUnoStruct("com.sun.star.beans.PropertyValue")
        node.Name = "nodepath"
        node.Value = "/org.openoffice.Setup/L10N"
        access = provider.createInstanceWithArguments(
            "com.sun.star.configuration.ConfigurationAccess", (node,)
        )
        return access.getByName("ooLocale") or "en"
    except Exception:  # noqa: BLE001 - fall back to English rather than fail
        return "en"


def settings_path(ctx) -> str:
    substitution = ctx.getServiceManager().createInstanceWithContext(
        "com.sun.star.util.PathSubstitution", ctx
    )
    user = uno.fileUrlToSystemPath(substitution.substituteVariables("$(user)", True))
    return os.path.join(user, f"{brand.ID}-settings.json")


class Emphasis(unohelper.Base, XJobExecutor):
    def __init__(self, ctx):
        self.ctx = ctx

    def _desktop(self):
        return self.ctx.getServiceManager().createInstanceWithContext(
            "com.sun.star.frame.Desktop", self.ctx
        )

    def _tell(self, message: str) -> None:
        frame = self._desktop().getCurrentFrame()
        toolkit = self.ctx.getServiceManager().createInstanceWithContext(
            "com.sun.star.awt.Toolkit", self.ctx
        )
        box = toolkit.createMessageBox(
            frame.getContainerWindow(), INFOBOX, BUTTONS_OK, brand.NAME, message
        )
        box.execute()

    def trigger(self, command):
        doc = self._desktop().getCurrentComponent()
        if doc is None or not doc.supportsService("com.sun.star.text.TextDocument"):
            return
        t = i18n.messages_for(ui_locale(self.ctx))
        path = settings_path(self.ctx)
        current = settings.load(path)
        action, _, value = command.partition(":")

        if action == "document":
            writer.emphasize_document(
                doc, current.strength, current.style, brand.STYLE_NAME, t["menuDocument"]
            )
        elif action == "selection":
            done = writer.emphasize_selection(
                doc, current.strength, current.style, brand.STYLE_NAME, t["menuSelection"]
            )
            if done < 0:
                self._tell(t["noSelection"])
        elif action == "remove":
            writer.remove_document_emphasis(doc, brand.STYLE_NAME, t["menuRemove"])
        elif action == "style" and value in writer.STYLES:
            current.style = value
            settings.save(path, current)
            writer.restyle(doc, value, brand.STYLE_NAME)
            label = t["style" + value.capitalize()]
            self._tell(t["styleSet"].format(value=label))
        elif action == "strength" and value in settings.STRENGTHS:
            current.strength = settings.STRENGTHS[value]
            settings.save(path, current)
            label = t["strength" + value.capitalize()]
            self._tell(t["strengthSet"].format(value=label))


g_ImplementationHelper = unohelper.ImplementationHelper()
g_ImplementationHelper.addImplementation(Emphasis, brand.IMPLEMENTATION, (brand.IMPLEMENTATION,))
