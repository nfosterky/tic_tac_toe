var tic_tac_toe = (function (window) {
  var COLOR_RED = "rgb(180, 0, 0)",
    COLOR_LIGHT_GRAY = "rgb(180,180,180)",
    COLOR_DEFAULT = COLOR_LIGHT_GRAY;

  var ttGrid = grid();

  function player (spec) {
    var me = {
      index: spec.index ? spec.index : 0,
      color: spec.color ? spec.color : COLOR_RED
    };

    return me;
  }

  function cell (spec) {
    var me = {
      index: spec.index,
      color: COLOR_DEFAULT,
      player: false
    };

    return me;
  }

  function grid (spec) {
    var me = {
      cells: {
        list: [],
        makeList: function () {
          var length = spec && spec.length ? spec.length : 9;

          this.list = [];
          for (var i = 0; i < length; i++) {
            this.list[i] = cell({ index: i });
          }
          console.log(this);
        }
      },

    };

    return me;
  }

  ttGrid.cells.makeList();

})(window);
