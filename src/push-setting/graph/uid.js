/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */

let IDX = 36
let HEX = ''
while (IDX--) HEX += IDX.toString(36)

export function uid (len) {
  let str = ''
  let num = len || 11
  while (num--) str += HEX[(Math.random() * 36) | 0]
  return str
}
