// micro:bit style: on start runs once, forever keeps going, on_button / on_switch react to your remote
on_start(async () => {
  show("Sticks are in charge!");
  lights_mode("rainbow");
});
forever(async () => {
  fly(stick("yaw"), stick("throttle"), stick("roll"), stick("pitch"));
});
on_button("Ⓐ", async () => {
  photo();
});
on_button("Ⓑ", async () => {
  flip("front");
});
on_switch("A", "down", async () => {
  flip("back");
});
