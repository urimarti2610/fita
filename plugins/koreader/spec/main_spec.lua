-- Smoke test of main.lua with KOReader's modules stubbed out.
local H = require("helper")
local describe, it, eq, truthy = H.describe, H.it, H.eq, H.truthy

local shown, settings, opened = {}, {}, {}
local function widget(kind)
    return { new = function(_, args) args.kind = kind; return args end }
end
package.preload["ui/widget/infomessage"] = function() return widget("info") end
package.preload["ui/widget/spinwidget"] = function() return widget("spin") end
package.preload["ui/uimanager"] = function()
    return { show = function(_, w) shown[#shown + 1] = w end, close = function() end }
end
package.preload["ui/trapper"] = function()
    return {
        wrap = function(_, fn) fn() end,
        dismissableRunInSubprocess = function(_, task) return true, task() end,
    }
end
package.preload["ui/widget/container/widgetcontainer"] = function()
    return {
        extend = function(_, t)
            t.new = function(class, o) setmetatable(o, { __index = class }); o:init(); return o end
            return t
        end,
    }
end
package.preload["libs/libkoreader-lfs"] = function()
    return {
        attributes = function(path)
            local f = io.open(path, "rb")
            if f then f:close(); return "file" end
        end,
    }
end
package.preload["logger"] = function() return { warn = function() end } end
package.preload["gettext"] = function() return function(s) return s end end
_G.G_reader_settings = {
    readSetting = function(_, key) return settings[key] end,
    saveSetting = function(_, key, value) settings[key] = value end,
}

local Fita = require("main")

local function menu(plugin)
    local items = {}
    plugin:addToMainMenu(items)
    return items.fita
end

describe("main.lua", function()
    local tmp = os.tmpname()
    local txt = tmp .. ".txt"
    local f = assert(io.open(txt, "wb"))
    f:write("Hola món\n\nSegon paràgraf")
    f:close()

    it("builds the reader menu and converts the open document", function()
        local ui = {
            menu = { registerToMainMenu = function() end },
            document = { file = txt },
            switchDocument = function(_, path) opened[#opened + 1] = path end,
        }
        local plugin = Fita:new{ ui = ui }
        local m = menu(plugin)
        eq(m.text, "Reading emphasis")
        eq(m.sorting_hint, "typeset")
        eq(m.sub_item_table[1].text, "Create a copy with emphasis")
        truthy(m.sub_item_table[1].enabled_func())
        eq(m.sub_item_table[2].text_func(), "Strength: 45 %")
        m.sub_item_table[1].callback()
        eq(opened[1], tmp .. ".fita.html")
        local out = H.read(tmp .. ".fita.html")
        truthy(out:find('<b class="fita-e">Ho</b>la', 1, true), out)
        truthy(out:find(".fita-e { font-weight: bold; }", 1, true))
    end)

    it("changes settings and reports unsupported files", function()
        local ui = { menu = { registerToMainMenu = function() end } }
        local plugin = Fita:new{ ui = ui }
        local m = menu(plugin)
        eq(m.sorting_hint, "tools")
        m.sub_item_table[1].callback()
        shown[#shown].callback({ value = 70 })
        eq(settings.fita.strength, 0.7)
        m.sub_item_table[2].sub_item_table[2].callback()
        eq(settings.fita.style, "underline")
        plugin:convert("/tmp/comic.cbz")
        eq(shown[#shown].text, "Only EPUB, HTML and TXT files can be converted.")
    end)

    it("translates the interface", function()
        local L = require("fita_l10n")
        eq(L.translate("ca", "Strength: %1 %", 45), "Intensitat: 45 %")
        eq(L.translate("es", "Reading emphasis"), "Énfasis de lectura")
        eq(L.translate("fr", "Reading emphasis"), "Reading emphasis")
        for _, catalog in pairs(L.catalogs) do
            for source, translated in pairs(catalog) do
                local _, a = source:gsub("%%%d", "")
                local _, b = translated:gsub("%%%d", "")
                eq(b, a, translated)
            end
        end
    end)

    os.remove(txt)
    os.remove(tmp .. ".fita.html")
    os.remove(tmp)
end)
