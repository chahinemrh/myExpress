import { readFile } from "fs";
import http from "http";
import { join } from "path";
import { parse } from "url";
import RouteType from "./RouteType";
class MyExpress {
    constructor() {
        this.routes = [];
        this.middlewares = [];
        this.TEMPLATE_PATH = "./templates";
        this.TEMPLATE_EXT = ".html";
        this.config = {
            templatePath: this.TEMPLATE_PATH
        };
        this.server = http.createServer(async (req, res) => {
            const request = this.handleRequest(req);
            const response = this.handleResponse(res);
            try {
                for (const middleware of this.middlewares) {
                    await new Promise((resolve, reject) => {
                        response.on("close", reject);
                        middleware(request, response, () => resolve());
                    });
                }
            }
            catch (_) {
                return;
            }
            const routeFind = this.routes.find((route) => {
                if (route.type !== req.method && route.type !== RouteType.ALL) {
                    return false;
                }
                const matcher = req.url.match(route.regex);
                const isMatched = matcher && matcher.length > 0;
                if (!isMatched && route.path !== req.url) {
                    return false;
                }
                request.params = {};
                if (isMatched) {
                    request.params = matcher.groups;
                }
                request.query = {};
                const queryStr = parse(req.url).query || "";
                queryStr.split("&").forEach((q) => {
                    const [key, value] = q.split("=");
                    request.query[key] = value;
                });
                return true;
            });
            if (routeFind) {
                routeFind.callback(request, response);
            }
            else {
                response.send("404 Route not found", 404);
            }
        });
    }
    listen(port, callback) {
        this.server.listen(port, callback);
    }
    setConfig(config) {
        this.config = config;
    }
    get(path, callback) {
        this.manageListener(path, callback, RouteType.GET);
    }
    post(path, callback) {
        this.manageListener(path, callback, RouteType.POST);
    }
    put(path, callback) {
        this.manageListener(path, callback, RouteType.PUT);
    }
    delete(path, callback) {
        this.manageListener(path, callback, RouteType.DELETE);
    }
    all(path, callback) {
        this.manageListener(path, callback, RouteType.ALL);
    }
    use(callback) {
        if (!callback) {
            return;
        }
        this.middlewares.push(callback);
    }
    render(file, paramsOrCallback, callback) {
        let params;
        if (callback) {
            params = paramsOrCallback;
        }
        else {
            callback = paramsOrCallback;
        }
        if (!file || file.trim().length < 1) {
            throw new Error("File template name cannot be null or empty");
        }
        const pathName = join(this.config.templatePath, `${file}${this.TEMPLATE_EXT}`);
        readFile(pathName, "utf-8", (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            let html = data.toString();
            if (params) {
                // Handle if conditions
                const ifElseRegex = /{{ *if *(.*) *}}((\n(.*))*){{ *endif *}}/gm;
                html = html.replace(ifElseRegex, (_, ...args) => {
                    let [condition, content] = args;
                    content = content.trim();
                    condition = condition.replace(/["]?([a-zA-Z-_]+)["]?/g, (item) => {
                        return item.includes('"') ? item : `params.${item}`;
                    });
                    if (!eval(condition)) {
                        return "";
                    }
                    return content;
                });
                // Handle simple variable with transformers
                const regex = /{{ ?(\w+)(( ?[|] ?)((\w+)(\:([0-9]+))?))? ?}}/gi;
                html = html.replace(regex, (_, ...args) => {
                    const [key, , pipe, , setting, , optional] = args;
                    const newValue = `${params[key]}`;
                    if (!newValue) {
                        return "UNDEFINED";
                    }
                    if (!pipe && !setting) {
                        return newValue;
                    }
                    switch (setting.toUpperCase()) {
                        case "UPPER": return this.upper(newValue);
                        case "LOWER": return this.lower(newValue);
                        case "FIXED": return this.fixed(newValue, optional);
                    }
                    return newValue;
                });
            }
            callback(null, html);
        });
    }
    upper(value) {
        return value.toUpperCase();
    }
    lower(value) {
        return value.toLowerCase();
    }
    fixed(value, limit) {
        if (isNaN(parseInt(limit, 10))) {
            return value;
        }
        if (isNaN(parseFloat(value))) {
            return value;
        }
        return parseFloat(value).toFixed(parseInt(limit, 10));
    }
    handleRequest(req) {
        const request = req;
        return request;
    }
    handleResponse(res) {
        const response = res;
        const sendResponse = (contentType, content, statusCode) => {
            response.writeHead(statusCode || 200, { "Content-Type": contentType });
            response.write(content);
            response.end();
        };
        response.json = (object, statusCode) => {
            sendResponse("application/json", JSON.stringify(object), statusCode);
        };
        response.html = (html, statusCode) => {
            sendResponse("text/html", html, statusCode);
        };
        response.send = (content, statusCode) => {
            if (typeof content === "string") {
                response.html(content, statusCode);
            }
            else {
                response.json(content, statusCode);
            }
        };
        return response;
    }
    manageListener(path, callback, type) {
        const routeFind = this.routes.find((route) => route.path === path && route.type === type);
        if (routeFind) {
            routeFind.callback = callback;
            return;
        }
        const regexStr = path.replace(/\//g, "\\/").replace(/(:([\w]+))/g, (_, ...args) => {
            const [, param] = args;
            return `(?<${param}>\\w+)`;
        });
        const regex = new RegExp(`^${regexStr}(\\/)?(\\?.*)?$`);
        this.routes.push({ path, regex, type, callback });
    }
}
export default function () {
    return new MyExpress();
}
export * from "./myExpress.d";
