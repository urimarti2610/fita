-- Minimal test harness for plain Lua 5.1 / LuaJIT: no busted needed.
local H = { passed = 0, failed = 0 }

local here = debug.getinfo(1, "S").source:match("^@(.*/)") or "./"
H.root = here .. "../"
package.path = H.root .. "fita.koplugin/?.lua;" .. here .. "?.lua;" .. package.path

local current = ""
function H.describe(name, fn)
    current = name
    fn()
end

function H.it(name, fn)
    local ok, err = pcall(fn)
    if ok then
        H.passed = H.passed + 1
    else
        H.failed = H.failed + 1
        io.stderr:write(("FAIL %s > %s\n  %s\n"):format(current, name, tostring(err)))
    end
end

local function show(v)
    if type(v) == "string" then return ("%q"):format(v) end
    return tostring(v)
end

function H.eq(actual, expected, message)
    if actual ~= expected then
        error(("%sexpected %s, got %s"):format(message and (message .. ": ") or "", show(expected),
            show(actual)), 2)
    end
end

function H.truthy(value, message)
    if not value then error(message or "expected a truthy value", 2) end
end

function H.raises(fn, pattern)
    local ok, err = pcall(fn)
    if ok then error("expected an error", 2) end
    if pattern and not tostring(err):find(pattern) then
        error("unexpected error: " .. tostring(err), 2)
    end
end

function H.read(path)
    local f = assert(io.open(path, "rb"))
    local data = f:read("*a")
    f:close()
    return data
end

--- Tiny JSON decoder (objects, arrays, strings with \u escapes, numbers, literals).
function H.json(text)
    local E = require("fita_emphasis")
    local i = 1
    local value
    local function ws() i = text:find("[^ \t\r\n]", i) or #text + 1 end
    local function str()
        local out = {}
        i = i + 1
        while true do
            local c = text:sub(i, i)
            if c == '"' then i = i + 1; break end
            if c == "\\" then
                local e = text:sub(i + 1, i + 1)
                if e == "u" then
                    local cp = tonumber(text:sub(i + 2, i + 5), 16)
                    i = i + 6
                    if cp >= 0xD800 and cp <= 0xDBFF and text:sub(i, i + 1) == "\\u" then
                        local low = tonumber(text:sub(i + 2, i + 5), 16)
                        cp = 0x10000 + (cp - 0xD800) * 0x400 + (low - 0xDC00)
                        i = i + 6
                    end
                    out[#out + 1] = E.encode(cp)
                else
                    local map = { n = "\n", t = "\t", r = "\r", b = "\b", f = "\f" }
                    out[#out + 1] = map[e] or e
                    i = i + 2
                end
            else
                local j = text:find('["\\]', i)
                out[#out + 1] = text:sub(i, j - 1)
                i = j
            end
        end
        return table.concat(out)
    end
    function value()
        ws()
        local c = text:sub(i, i)
        if c == "{" then
            local t = {}
            i = i + 1
            ws()
            if text:sub(i, i) == "}" then i = i + 1; return t end
            while true do
                ws()
                local k = str()
                ws()
                i = i + 1 -- :
                t[k] = value()
                ws()
                local d = text:sub(i, i)
                i = i + 1
                if d == "}" then return t end
            end
        elseif c == "[" then
            local t = {}
            i = i + 1
            ws()
            if text:sub(i, i) == "]" then i = i + 1; return t end
            while true do
                t[#t + 1] = value()
                ws()
                local d = text:sub(i, i)
                i = i + 1
                if d == "]" then return t end
            end
        elseif c == '"' then
            return str()
        elseif text:sub(i, i + 3) == "true" then
            i = i + 4; return true
        elseif text:sub(i, i + 4) == "false" then
            i = i + 5; return false
        elseif text:sub(i, i + 3) == "null" then
            i = i + 4; return nil
        else
            local j = text:find("[^%d%.eE+-]", i) or #text + 1
            local n = tonumber(text:sub(i, j - 1))
            i = j
            return n
        end
    end
    return value()
end

function H.done()
    print(("%d passed, %d failed"):format(H.passed, H.failed))
    os.exit(H.failed == 0 and 0 or 1)
end

return H
