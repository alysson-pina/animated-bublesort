/** 
 * Takes in a list of numbers and returns instances of the list at each step of bubble sort
 */
export default function bubbleSort(list: number[]) {
  let inputArr = [...list];
  let steps = [[...list]];
  let len = inputArr.length;

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (inputArr[j] > inputArr[j + 1]) {
        let tmp = inputArr[j];
        inputArr[j] = inputArr[j + 1];
        inputArr[j + 1] = tmp;

        steps.push([...inputArr]);
      }
    }
  }

  return steps;
};
