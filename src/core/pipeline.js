export var postCompile = passThrough;
export function postCompileInterceptor(func) {
  postCompile = func;
}



// --- private ---

function noop() {};
function passThrough(value) {
  return value;
}
