
export function expose(service) {
  return function(target, key, descriptor) {
    service.on(key, descriptor.value);
  }
}
