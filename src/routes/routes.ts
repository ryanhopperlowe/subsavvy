type Params = Record<string, string>;

type RouteParams<TQuery extends Params, TPath extends Params> = TPath & {
  queryParams?: TQuery;
};

class Route<TQuery extends Params = {}, TPath extends Params = {}> {
  // TODO: get from env
  static ROOT = "http://localhost:3000";

  constructor(public readonly _path: string) {}

  createRoute<TQ extends TQuery = TQuery, TP extends TPath = TPath>(
    path: string,
  ) {
    if (this._path === "/") return new Route<TQ, TP>(path);

    return new Route<TQ, TP>(this._path + path);
  }

  path(params?: RouteParams<TQuery, TPath>) {
    if (!params) return this._path;

    const qs = new URLSearchParams(params?.queryParams || {});
    return Object.keys(params).reduce(
      (acc, key) => {
        return acc.replace(`:${key}`, params[key].toString());
      },
      `${this._path}${qs && "?"}${qs}`,
    );
  }

  api(params?: RouteParams<TQuery, TPath>) {
    return Route.ROOT + this.path(params);
  }

  toString() {
    return this._path;
  }
}

const home = new Route("/");

const user = home.createRoute("/user");
const updateProfile = user.createRoute("/update");

const services = home.createRoute("/my-services");
const serviceView = services.createRoute<{}, { id: string }>("/:id");
const createService = services.createRoute("/create");

const plans = serviceView.createRoute("/plans");
const createPlan = plans.createRoute("/create");

const api = new Route("/api");

const auth = api.createRoute("/auth");

const login = auth.createRoute("/signin");

export const Routes = {
  serviceList: services,
  planList: plans,
  createService,
  serviceView,
  createPlan,
  home,
  login,
  updateProfile,
};

export const trpcRoute = api.createRoute("/trpc");
