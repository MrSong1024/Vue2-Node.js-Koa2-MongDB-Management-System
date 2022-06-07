/**
 * @Author: Songjq6
 * @Date: 2020-06-02 08:42:18
 * @Function: 函数节流（节流函数）
 */
const thottles = function() {
  this.dingshi = "";
};
thottles.prototype.timeEnd = function(fn, time) {
  if (this.dingshi) {
    this.dingshi = clearTimeout(this.dingshi);
  }
  this.dingshi = setTimeout(() => {
    fn();
  }, time);
};

export default thottles;
