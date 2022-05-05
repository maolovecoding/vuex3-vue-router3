// 创建映射表 数组扁平化 给的是数组 返回是对象 扁平化路由规则
function createRouteMap(routes, pathMap) {
  // let pathMap = {};
  // 第一次是创建 第二次是添加路由规则
  pathMap = pathMap || {};
  routes.forEach((route) => addRouteRecord(route, pathMap));
  return pathMap;
}
function addRouteRecord(route, pathMap, parentRecord) {
  // 有上一级的路由 则拼接上父路由的路径
  const path = parentRecord
    ? `${
        parentRecord.path?.endsWith("/")
          ? parentRecord.path
          : `${parentRecord.path}/`
      }${route.path}`
    : route.path;
  const record = {
    path,
    component: route.component,
    props: route.props,
    meta: route.meta,
    parent: parentRecord,
  };
  // 没有该路由地址
  if (!pathMap[path]) {
    // 维护path对应的属性
    pathMap[path] = record;
  }
  // 递归添加子路由规则
  route.children?.forEach((childRoute) =>
    addRouteRecord(childRoute, pathMap, record)
  );
}
export default createRouteMap;
