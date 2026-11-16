-- Runs every spec: luajit plugins/koreader/spec/run.lua (or lua5.1)
local here = debug.getinfo(1, "S").source:match("^@(.*/)") or "./"
package.path = here .. "?.lua;" .. package.path
local H = require("helper")
for _, name in ipairs({ "emphasis_spec", "markup_spec", "epub_spec", "main_spec" }) do
    local ok, err = pcall(require, name)
    if not ok then
        H.failed = H.failed + 1
        io.stderr:write("ERROR loading " .. name .. ": " .. tostring(err) .. "\n")
    end
end
H.done()
