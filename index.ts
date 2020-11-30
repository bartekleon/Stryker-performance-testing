import * as fs from 'fs';
import * as path from 'path';

const SRC_FOLDER = 'src';
const TEST_FOLDER = 'test';
const FUNCTION_DEFINITION = (index: number) => {
  return `export const test${index} = (a: number, b: number) => {
    return a + b;
  };`;
};
const TEST_DEFINITION = (index: number) => {
  return `expect(testFunctions.test${index}(2, 2)).to.be.equal(4);`;
};

const UID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const random = (max: number, min = 0) => Math.floor(Math.random() * (max + 1 - min)) + min;

const createFunctions = (size: number, func: (index: number) => string) => {
  return Array(size)
    .fill(func)
    .map((e, i) => e(i))
    .join('\n');
};

const saveFile = (folder: string, filename: string, data: string) => {
  const p = path.join(folder, `${filename}.ts`);

  if (fs.existsSync(p)) {
    return false;
  }

  fs.writeFileSync(p, data, 'utf-8');

  return true;
};

const saveToSrc = (filename: string, data: string) => {
  return saveFile(SRC_FOLDER, filename, data);
};
const saveToTest = (filename: string, data: string) => {
  data = `import * as testFunctions from '../${SRC_FOLDER}/${filename}';
  import { expect } from 'chai';
  describe('test', () => {
    it('should pass', () => {
      ${data}
    });
  });`;
  return saveFile(TEST_FOLDER, filename, data);
};

const createSourceFile = (size: number) => createFunctions(size, FUNCTION_DEFINITION);
const createTestFile = (size: number) => createFunctions(size, TEST_DEFINITION);

const randomDistribution = (size: number, filesNumber: number) => {
  const distribution = [0, size];

  for (let i = 0; i < filesNumber - 1; i++) {
    distribution.push(random(size));
  }

  const sorted = distribution.sort((a, b) => a - b);
  const results = [];

  for (let i = 1; i < sorted.length; i++) {
    results.push(sorted[i] - sorted[i - 1]);
  }

  return results;
};

/**
 * @param size number of functions (number of mutators can differ depending on complexity of the function)
 */
export const scenarioAllInOneFile = (size: number) => {
  const filename = UID();
  saveToSrc(filename, createSourceFile(size));
  saveToTest(filename, createTestFile(size));
};

/**
 * @param size number of functions (number of mutators can differ depending on complexity of the function)
 * @param distribution number of tests in a file.
 * There will be ~ size / distribution files
 */
export const scenarioUniformlyDistributed = (size: number, distribution: number) => {
  for (let i = 0; i < size; i += distribution) {
    const filename = UID();
    saveToSrc(filename, createSourceFile(distribution));
    saveToTest(filename, createTestFile(distribution));
  }
};

/**
 * @param size number of functions (number of mutators can differ depending on complexity of the function)
 * @param filesNumber how many files there will be
 */
export const scenarioRandomlyDistributed = (size: number, filesNumber: number) => {
  for (const distribution of randomDistribution(size, filesNumber)) {
    const filename = UID();
    saveToSrc(filename, createSourceFile(distribution));
    saveToTest(filename, createTestFile(distribution));
  }
};
