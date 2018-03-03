export const getCurrentTimestamp = ():number => Math.round(new Date().getTime() / 1000);

const HEX_TABLE = {
  '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
  '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
  'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
  'e': '1110', 'f': '1111'
};
export const hex2Binary = (input: string): string => {
  const length = input.length;
  let output: string = '';

  for (let i: number = 0; i < length; i = i + 1) {
    if (HEX_TABLE[input[i]]) {
      output += HEX_TABLE[input[i]];
    } else {
      return null;
    }
  }
  return output;
};

export const binary2Hex = (byteArray): string => {
  return Array.from(byteArray, (byte: any)=> {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
};

export const flatMap = (arr, callback) => Array.prototype.concat.apply([], arr.map(callback));