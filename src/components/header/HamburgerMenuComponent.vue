<template>
<div id="hamburger">
  <div></div>
  <div></div>
  <div></div>
</div>
</template>

<style scoped lang="scss">
#hamburger {
  position: absolute;
  right: 16px;
  height: 20px;
  width: 40px;
  display: inline-block;
  box-sizing: border-box;
}
#hamburger div {
  position: absolute;
  left: 0;
  height: 1.5px;
  width: 40px;
  background-color: #444;
  border-radius: 2px;
  display: inline-block;
  box-sizing: border-box;
}
#hamburger div:nth-of-type(1) {
  bottom: 20px;
}
#hamburger div:nth-of-type(2) {
  bottom: 10px;
}
#hamburger div:nth-of-type(3) {
  bottom: 0;
}
</style>