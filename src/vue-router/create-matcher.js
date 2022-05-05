import createRouteMap from "./create-route-map";
function createMatcher(routes) {
  // 创建一个映射表
  const pathMap = createRouteMap(routes);
  // console.log(pathMap);
  // 动态添加路径信息
  function addRoutes(routes, pathMap) {
    createRouteMap(routes, pathMap);
  }
  function addRoute(route, pathMap) {
    createRouteMap([route], pathMap);
  }
  function match(location) {
    return pathMap[location];
  }
  return {
    addRoutes, //一次性添加多个路由规则
    addRoute, // 添加一个路由规则
    match, // 给我一个路径 返回对应的路由
  };
}
export default createMatcher;
