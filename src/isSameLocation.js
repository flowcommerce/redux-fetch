const isSameLocation = (prevLocation, nextLocation) => (
  prevLocation.pathname === nextLocation.pathname
  && prevLocation.search === nextLocation.search
  && prevLocation.key === nextLocation.key
);

export default isSameLocation;
