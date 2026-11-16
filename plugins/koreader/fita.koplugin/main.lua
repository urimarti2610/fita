--[[
fita for KOReader: reading emphasis (the start of each word in bold).

KOReader's rendering engine (crengine) cannot style the start of each word:
CSS has no selector for it. So the plugin rewrites the book instead: it creates
an emphasized copy next to the original (book.fita.epub) and opens it. The
original is never modified. Everything runs on the device, in a subprocess that
can be cancelled.
]]

local InfoMessage = require("ui/widget/infomessage")
local SpinWidget = require("ui/widget/spinwidget")
local Trapper = require("ui/trapper")
local UIManager = require("ui/uimanager")
local WidgetContainer = require("ui/widget/container/widgetcontainer")
local lfs = require("libs/libkoreader-lfs")
local logger = require("logger")

local Convert = require("fita_convert")
local Emphasis = require("fita_emphasis")
local L10n = require("fita_l10n")
-- Required here: KOReader only puts the plugin folder on package.path while loading this file.
local Markup = require("fita_markup")

local SETTINGS_KEY = "fita"
local WEBSITE = "https://fitaread.com"
local DEFAULTS = { strength = 0.45, every = 1, style = "bold", open_copy = true }
--- crengine has no opacity, so the fading styles of the web are not offered.
local STYLES = { "bold", "underline", "color" }

local Fita = WidgetContainer:extend{
    name = "fita",
    is_doc_only = false,
}

function Fita:init()
    self.T = L10n.translator()
    self.settings = G_reader_settings:readSetting(SETTINGS_KEY) or {}
    for k, v in pairs(DEFAULTS) do
        if self.settings[k] == nil then self.settings[k] = v end
    end
    self.ui.menu:registerToMainMenu(self)
    -- File browser: a button in the long-press dialog of supported files.
    if self.ui.file_chooser and self.ui.addFileDialogButtons then
        self.ui:addFileDialogButtons("fita", function(file, is_file)
            if not is_file or not Convert.target_path(file) then return nil end
            return {
                {
                    text = self.T("Create a copy with emphasis"),
                    callback = function()
                        if self.ui.file_chooser.file_dialog then
                            UIManager:close(self.ui.file_chooser.file_dialog)
                        end
                        self:convert(file)
                    end,
                },
            }
        end)
    end
end

function Fita:onCloseWidget()
    if self.ui.file_chooser and self.ui.removeFileDialogButtons then
        self.ui:removeFileDialogButtons("fita")
    end
end

function Fita:save()
    G_reader_settings:saveSetting(SETTINGS_KEY, self.settings)
end

function Fita:styleName(style)
    local names = { bold = "Bold", underline = "Soft underline", color = "Colour" }
    return self.T(names[style] or "Bold")
end

function Fita:addToMainMenu(menu_items)
    local T = self.T
    local items = {}
    if self.ui.document then
        table.insert(items, {
            text = T("Create a copy with emphasis"),
            enabled_func = function() return Convert.target_path(self.ui.document.file) ~= nil end,
            callback = function() self:convert(self.ui.document.file) end,
            separator = true,
        })
    end
    table.insert(items, {
        text_func = function() return T("Strength: %1 %", math.floor(self.settings.strength * 100 + 0.5)) end,
        keep_menu_open = true,
        callback = function(touchmenu)
            UIManager:show(SpinWidget:new{
                title_text = T("Strength"),
                info_text = T("Part of each word to emphasize"),
                value = math.floor(self.settings.strength * 100 + 0.5),
                value_min = Emphasis.MIN_STRENGTH * 100,
                value_max = Emphasis.MAX_STRENGTH * 100,
                value_step = 5,
                value_hold_step = 10,
                default_value = DEFAULTS.strength * 100,
                unit = "%",
                callback = function(spin)
                    self.settings.strength = spin.value / 100
                    self:save()
                    if touchmenu then touchmenu:updateItems() end
                end,
            })
        end,
    })
    local style_items = {}
    for _, style in ipairs(STYLES) do
        table.insert(style_items, {
            text = self:styleName(style),
            radio = true,
            checked_func = function() return self.settings.style == style end,
            callback = function()
                self.settings.style = style
                self:save()
            end,
        })
    end
    table.insert(items, {
        text_func = function() return T("Style") .. ": " .. self:styleName(self.settings.style) end,
        sub_item_table = style_items,
    })
    table.insert(items, {
        text_func = function() return T("Emphasize one word in every: %1", self.settings.every) end,
        keep_menu_open = true,
        callback = function(touchmenu)
            UIManager:show(SpinWidget:new{
                title_text = T("Emphasize one word in every"),
                value = self.settings.every,
                value_min = 1,
                value_max = 10,
                default_value = DEFAULTS.every,
                callback = function(spin)
                    self.settings.every = spin.value
                    self:save()
                    if touchmenu then touchmenu:updateItems() end
                end,
            })
        end,
    })
    table.insert(items, {
        text = T("Open the copy when it is ready"),
        checked_func = function() return self.settings.open_copy end,
        callback = function()
            self.settings.open_copy = not self.settings.open_copy
            self:save()
        end,
        separator = true,
    })
    table.insert(items, {
        text = T("About"),
        keep_menu_open = true,
        callback = function()
            UIManager:show(InfoMessage:new{
                text = T("fita adds anchor points to text: it gently emphasizes the start of each word to guide your eyes.\n\nKOReader cannot change how words are drawn, so the plugin creates an emphasized copy of the book next to the original (book.fita.epub). Change the settings and create the copy again whenever you like: the original is never modified.\n\nEverything happens on this device. %1", WEBSITE),
            })
        end,
    })
    menu_items.fita = {
        text = T("Reading emphasis"),
        sorting_hint = self.ui.document and "typeset" or "tools",
        sub_item_table = items,
    }
end

local function exists(path)
    return lfs.attributes(path, "mode") == "file"
end

function Fita:convert(file)
    local T = self.T
    local source = Convert.source_path(file, exists)
    local target, format = Convert.target_path(source)
    if not target then
        UIManager:show(InfoMessage:new{ text = T("Only EPUB, HTML and TXT files can be converted.") })
        return
    end
    local options = Emphasis.resolve_options({ strength = self.settings.strength, every = self.settings.every })
    local style = self.settings.style
    local temp = target .. ".part"

    local function work()
        local ok, err = pcall(function()
            local transform = Convert.transformer(options, style, true)
            if format == "epub" then
                Convert.convert_epub(source, temp, transform)
            else
                Convert.convert_document(source, temp, transform, Markup.static_css(style),
                    format == "txt")
            end
            assert(os.rename(temp, target))
        end)
        if ok then return { ok = true } end
        os.remove(temp)
        if type(err) == "table" then return { code = err.code } end
        return { message = tostring(err) }
    end

    Trapper:wrap(function()
        local completed, result = Trapper:dismissableRunInSubprocess(work,
            T("Creating a copy with emphasis…\n\nTap to cancel."))
        if not completed then
            os.remove(temp)
            return
        end
        result = result or { message = "?" }
        if not result.ok then
            local text
            if result.code == "drm" then
                text = T("This book is protected with DRM and cannot be converted.")
            elseif result.code == "invalid" then
                text = T("This file is not a valid EPUB book.")
            else
                logger.warn("fita: conversion failed", result.message)
                text = T("The copy could not be created:\n%1", result.message or result.code or "?")
            end
            UIManager:show(InfoMessage:new{ text = text })
            return
        end
        if self.ui.file_chooser then self.ui.file_chooser:refreshPath() end
        if self.settings.open_copy then
            self:open(target)
        else
            UIManager:show(InfoMessage:new{ text = T("Copy created:\n%1", target), timeout = 3 })
        end
    end)
end

function Fita:open(path)
    if self.ui.document and self.ui.switchDocument then
        self.ui:switchDocument(path)
    else
        local ReaderUI = require("apps/reader/readerui")
        ReaderUI:showReader(path)
    end
end

return Fita
