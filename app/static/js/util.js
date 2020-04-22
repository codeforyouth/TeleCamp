
function generateUserID(num) {
  var based_strings = "0123456789abcdefghijklmnoqrstuvwxyz".split("") // 0-zの文字列の配列
  var based_n = convertBasedRepr(num, 35);
  var dst = "";
  for (var j = 0; j < based_n.length; j++) {
    dst = based_strings[based_n[j]] + dst;
  }
  return dst;
}

function convertBasedRepr(x, n) {
  var result = [];
  do {
    var t = x % n;
    result.push(t);
    var m = Math.floor(x / n);
    if (m < n) {
      if (m !== 0) {
        result.push(m);
      }
      break;
    }
    x = (x - t) / n;
  } while(1);
  return result;
}