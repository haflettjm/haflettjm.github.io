
import data from "./data.json" with { type: "json" };

export default defineCachedEventHandler(() => {
  return data;
});
