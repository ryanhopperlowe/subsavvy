type RouteParams = {
  [key: string]: string | number | boolean;
} & {
  queryParams?: Record<string, string>;
};

class Route<T extends RouteParams = never> {
  static ROOT = "http://localhost:3000";

  constructor(public readonly _path: string) {}

  createRoute(path: string) {
    if (this._path === "/") return new Route(path);

    return new Route(this._path + path);
  }

  path(params?: T) {
    if (!params) return this._path;

    const qs = new URLSearchParams(params?.queryParams || {});
    return Object.keys(params).reduce(
      (acc, key) => {
        return acc.replace(`:${key}`, params[key].toString());
      },
      `${this._path}${qs && "?"}${qs}`
    );
  }

  api(params?: T) {
    return Route.ROOT + this.path(params);
  }

  toString() {
    return this._path;
  }
}

const home = new Route("/");
const createClient = home.createRoute("/create-client");

const api = new Route("/api");

const auth = api.createRoute("/auth");

const login = auth.createRoute("/signin");

export const Routes = {
  createClient,
  home,
  login,
};

export const trpcRoute = api.createRoute("/trpc");
