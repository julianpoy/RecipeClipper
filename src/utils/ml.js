// Self import for mock
import * as self from './ml';
import { getInnerText } from './innerText';
import {
  applyLIBlockStyling,
} from './element';
import {
  ingredientSectionHeader,
  instructionSectionHeader,
} from '../constants/regex';

export const getDocumentContent = (config) => {
  const { body } = config.window.document;
  applyLIBlockStyling(body);

  return getInnerText(body).split('\n').map((line) => line.trim()).filter((line) => line);
};

export const findPotentialSetsByHeader = (config, headerRegexp) => {
  const content = self.getDocumentContent(config);

  return content.filter((line) => line.match(headerRegexp))
    .map((line) => content.slice(content.indexOf(line) + 1));
};

export const loadModel = async (config) => {
  const modelUrl = config.options.mlModelEndpoint;
  if (!modelUrl) throw new Error('You must provide window.RC_ML_MODEL_ENDPOINT or options.mlModelEndpoint to use local classification');
  return config.window.tf.loadLayersModel(modelUrl);
};

export const mlClassifyLocal = async (config, lines) => {
  const model = await self.loadModel(config);
  const useModel = await config.window.use.load();

  const predictions = [];
  for (let i = 0; i < lines.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const encodedData = await useModel.embed([lines[i]]);
    const prediction = model.predict(encodedData).dataSync();
    predictions.push(prediction);
  }

  return predictions;
};

export const mlClassifyRemote = async (config, lines) => {
  const remote = config.options.mlClassifyEndpoint;
  if (!remote) throw new Error('You must provide window.RC_ML_CLASSIFY_ENDPOINT or options.mlClassifyEndpoint to use remote classification');

  const response = await config.window.fetch(remote, {
    method: 'POST',
    body: JSON.stringify({
      sentences: lines,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};

export const mlClassify = async (config, lines) => {
  const isTFJSAvailable = config.window.tf && config.window.tf.loadLayersModel;
  const isUSEAvailable = config.window.use && config.window.use.load;

  if (isTFJSAvailable && isUSEAvailable) return self.mlClassifyLocal(config, lines);
  return self.mlClassifyRemote(config, lines);
};

export const mlFilter = async (config, lines, type) => {
  const predictions = await self.mlClassify(config, lines);

  let lastType = -1;
  const filteredOutput = [];
  for (let i = 0; i < lines.length; i += 1) {
    const predictedType = predictions[i].indexOf(Math.max(...predictions[i])) + 1;

    // Allow one line of error to be included
    // (say, an ingredient header or a stray bit of formatting)
    // Also allow some non-ingredient text at the very start (say, a section header)
    if (predictedType === type || lastType === type || i === 0) {
      filteredOutput.push(lines[i]);
      lastType = predictedType;
    } else {
      break;
    }
  }

  // Remove last element if it is not of the desired type
  // (consider our allowed buffer above may insert one undesired item at end)
  if (filteredOutput.length > 0 && lastType !== type) {
    filteredOutput.pop();
  }

  return filteredOutput;
};

export const findFullSearch = async (config, type) => {
  const content = self.getDocumentContent(config);

  const predictions = await self.mlClassify(config, content);

  const { groups, workingGroup } = content.reduce((acc, line, idx) => {
    const predictedType = predictions[idx].indexOf(Math.max(...predictions[idx])) + 1;

    const lastType = acc.workingGroup
      && acc.workingGroup.length > 0 ? acc.workingGroup[acc.workingGroup.length - 1].type : -1;

    // Allow one line of error to be included in group
    // (say, an ingredient header or a stray bit of formatting)
    // Also allow some non-ingredient text at the very start (say, a section header)
    if (predictedType === type || lastType === type || idx === 0) {
      acc.workingGroup = acc.workingGroup || [];
      acc.workingGroup.push({
        text: line,
        type: predictedType,
      });
    } else {
      // Group is considered complete
      if (acc.workingGroup && acc.workingGroup.length > 0) acc.groups.push(acc.workingGroup);
      acc.workingGroup = null;
    }

    return acc;
  }, {
    workingGroup: null,
    groups: [],
  });

  // If leftover working group (if ingredients/instructions end at very end of page)
  if (workingGroup) groups.push(workingGroup);

  groups.forEach((group) => {
    // Remove last element if it is not of the desired type
    // (consider our allowed buffer above may insert one undesired item at end)
    if (group.length > 0 && group[group.length - 1].type !== type) {
      group.pop();
    }
  });

  return groups
    .map((group) => group.map((item) => item.text))
    .map((group) => group.join('\n'))
    .reduce((a, b) => (a.length > b.length ? a : b), '');
};

export const findByHeader = async (config, type) => {
  const headerRegexp = type === 1 ? ingredientSectionHeader : instructionSectionHeader;
  const potentialSets = self.findPotentialSetsByHeader(config, headerRegexp);

  const sets = [];
  for (let i = 0; i < potentialSets.length; i += 1) {
    const potentialSet = potentialSets[i];
    // eslint-disable-next-line no-await-in-loop
    const set = await self.mlFilter(config, potentialSet, type);
    sets.push(set);
  }

  return sets.map((set) => set.join('\n'))
    .reduce((a, b) => (a.length > b.length ? a : b), '');
};

export const find = async (config, type) => {
  if (config.options.mlDisable) return '';

  const result = await self.findByHeader(config, type) || await self.findFullSearch(config, type);

  return result;
};

// Type 1 for ingredients
// Type 2 for instructions
// Others to be implemented in future...
export const grabByMl = async (config, type) => {
  try {
    return await self.find(config, type);
  } catch (e) {
    if (config.options.ignoreMLClassifyErrors) {
      return '';
    }

    throw e;
  }
};
