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
       init ();
        const server = http.createServer( (req, res) => {
            const request = this.Request(req);
            const response = this.Response(res);
           
            ///
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
 
        render(file, params=null,callback){
            if (file == 'home'){
                let content='' 
                let error=''
                try {
                    content = fs.readFileSync('html.mustache').toString()
                }
                catch (e){
                    error = e
                }
                
                if (params){
                    Object.entries(params).forEach(param => {
                        content=content.replace('{{'+param[0]+'}}',param[1]) 
                    })
                }
                callback(error,content)
            } 
        }
            
     
    
   
    Request(req) {
        const request = req;
        return request;
    }
    Response(res) {
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
export * from "./myExpress";
