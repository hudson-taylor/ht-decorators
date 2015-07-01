
export function expose(service, schema) {
  return function(target, key, descriptor) {
    let args = [ key, descriptor.value ];
    if(schema) args.splice(1, 0, schema);
    service.on(...args);
  }
}
